import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    linkTo?: string;
    linkText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    linkTo,
    linkText,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                    {trend && (
                        <p
                            className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {trend.isPositive ? '↑' : '↓'} {trend.value}
                        </p>
                    )}
                    {linkTo && linkText && (
                        <Link
                            to={linkTo}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                        >
                            {linkText} →
                        </Link>
                    )}
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
            </div>
        </div>
    );
};

export default StatCard;
