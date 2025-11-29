import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, ContactMessage } from '../../lib/supabase';
import { 
    FaEnvelope, 
    FaEnvelopeOpen, 
    FaTrash, 
    FaEye, 
    FaTimes, 
    FaSpinner,
    FaExclamationTriangle,
    FaInbox,
    FaCheck,
    FaReply,
    FaArchive,
    FaSync
} from 'react-icons/fa';

type MessageFilter = 'all' | 'new' | 'read' | 'replied' | 'archived';

const MessagesPage: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<MessageFilter>('all');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async (isRefresh: boolean = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            
            let query = supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setMessages(data || []);
        } catch (error: any) {
            console.error('Error fetching messages:', error.message);
            alert('Error loading messages: ' + error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchMessages(true);
    };

    const handleViewMessage = async (message: ContactMessage) => {
        setSelectedMessage(message);
        setAdminNotes(message.admin_notes || '');
        setShowModal(true);

        // Mark as read if it's new
        if (message.status === 'new') {
            await updateMessageStatus(message.id, 'read');
        }
    };

    const updateMessageStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('contact_messages')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            
            // Update local state
            setMessages(prev => prev.map(msg => 
                msg.id === id ? { ...msg, status: status as any } : msg
            ));

            if (selectedMessage?.id === id) {
                setSelectedMessage(prev => prev ? { ...prev, status: status as any } : null);
            }
        } catch (error: any) {
            console.error('Error updating message:', error);
            alert('Error updating message status: ' + error.message);
        }
    };

    const handleSaveNotes = async () => {
        if (!selectedMessage) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from('contact_messages')
                .update({ 
                    admin_notes: adminNotes,
                    updated_at: new Date().toISOString() 
                })
                .eq('id', selectedMessage.id);

            if (error) throw error;

            // Update local state
            setMessages(prev => prev.map(msg => 
                msg.id === selectedMessage.id ? { ...msg, admin_notes: adminNotes } : msg
            ));
            setSelectedMessage({ ...selectedMessage, admin_notes: adminNotes });

            alert('Заметки сохранены!');
        } catch (error: any) {
            console.error('Error saving notes:', error);
            alert('Error saving notes: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMessages(prev => prev.filter(msg => msg.id !== id));
            
            if (selectedMessage?.id === id) {
                setShowModal(false);
                setSelectedMessage(null);
            }

            alert('Сообщение удалено!');
        } catch (error: any) {
            console.error('Error deleting message:', error);
            alert('Error deleting message: ' + error.message);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'read': return 'bg-yellow-100 text-yellow-800';
            case 'replied': return 'bg-green-100 text-green-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Новое';
            case 'read': return 'Прочитано';
            case 'replied': return 'Отвечено';
            case 'archived': return 'В архиве';
            default: return status;
        }
    };

    const getFilteredCount = (filterType: MessageFilter) => {
        if (filterType === 'all') return messages.length;
        return messages.filter(msg => msg.status === filterType).length;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-gray-400 mx-auto mb-4" />
                    <div className="text-xl text-gray-600">Загрузка сообщений...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Сообщения</h1>
                    <p className="text-gray-500 mt-2">Управление сообщениями от пользователей</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={`flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 ${
                        refreshing ? 'cursor-not-allowed' : ''
                    }`}
                    title="Обновить список сообщений"
                >
                    <FaSync className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="font-medium">
                        {refreshing ? 'Обновление...' : 'Обновить'}
                    </span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`p-4 rounded-xl transition-all ${
                        filter === 'all' 
                            ? 'bg-gray-900 text-white shadow-lg' 
                            : 'bg-white hover:shadow-md'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Все</span>
                        <FaInbox className="text-lg" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{messages.length}</p>
                </button>

                <button
                    onClick={() => setFilter('new')}
                    className={`p-4 rounded-xl transition-all ${
                        filter === 'new' 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-white hover:shadow-md'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Новые</span>
                        <FaEnvelope className="text-lg" />
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {messages.filter(m => m.status === 'new').length}
                    </p>
                </button>

                <button
                    onClick={() => setFilter('read')}
                    className={`p-4 rounded-xl transition-all ${
                        filter === 'read' 
                            ? 'bg-yellow-600 text-white shadow-lg' 
                            : 'bg-white hover:shadow-md'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Прочитано</span>
                        <FaEnvelopeOpen className="text-lg" />
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {messages.filter(m => m.status === 'read').length}
                    </p>
                </button>

                <button
                    onClick={() => setFilter('replied')}
                    className={`p-4 rounded-xl transition-all ${
                        filter === 'replied' 
                            ? 'bg-green-600 text-white shadow-lg' 
                            : 'bg-white hover:shadow-md'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Отвечено</span>
                        <FaReply className="text-lg" />
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {messages.filter(m => m.status === 'replied').length}
                    </p>
                </button>

                <button
                    onClick={() => setFilter('archived')}
                    className={`p-4 rounded-xl transition-all ${
                        filter === 'archived' 
                            ? 'bg-gray-600 text-white shadow-lg' 
                            : 'bg-white hover:shadow-md'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Архив</span>
                        <FaArchive className="text-lg" />
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {messages.filter(m => m.status === 'archived').length}
                    </p>
                </button>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-12 text-center">
                        <FaInbox className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Нет сообщений</h3>
                        <p className="text-gray-500">
                            {filter === 'all' 
                                ? 'Пока не поступило ни одного сообщения' 
                                : `Нет сообщений со статусом "${getStatusLabel(filter)}"`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Статус
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        От кого
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Тема
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Дата
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {messages.map((message) => (
                                    <tr 
                                        key={message.id}
                                        className={`hover:bg-gray-50 transition-colors ${
                                            message.status === 'new' ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                                                {getStatusLabel(message.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{message.name}</div>
                                                <div className="text-sm text-gray-500">{message.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 truncate max-w-xs">
                                                {message.subject}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(message.created_at).toLocaleDateString('ru-RU', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewMessage(message)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Просмотреть"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(message.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Удалить"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {showModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-2xl text-gray-600" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Сообщение</h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(selectedMessage.created_at).toLocaleString('ru-RU')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Статус
                                </label>
                                <div className="flex gap-2">
                                    {['new', 'read', 'replied', 'archived'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateMessageStatus(selectedMessage.id, status)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                selectedMessage.status === status
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {getStatusLabel(status)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* From */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Имя
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        {selectedMessage.name}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <a 
                                            href={`mailto:${selectedMessage.email}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Phone (if available) */}
                            {selectedMessage.phone && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Телефон
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <a 
                                            href={`tel:${selectedMessage.phone}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {selectedMessage.phone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Тема
                                </label>
                                <div className="p-3 bg-gray-50 rounded-lg font-medium">
                                    {selectedMessage.subject}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Сообщение
                                </label>
                                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Заметки администратора
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Добавьте заметки для себя..."
                                />
                                <button
                                    onClick={handleSaveNotes}
                                    disabled={saving}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Сохранение...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck />
                                            Сохранить заметки
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
                            <button
                                onClick={() => handleDelete(selectedMessage.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FaTrash />
                                Удалить
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;

