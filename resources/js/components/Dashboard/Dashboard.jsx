import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Tag, ShoppingCart, Clock } from 'lucide-react';

function Dashboard({ username = "Super Admin" }) {
    const [stats, setStats] = useState({
        categories: 0,
        menuItems: 0,
        orders: 0,
        pendingBookings: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            const [categoriesRes, menuItemsRes] = await Promise.all([
                axios.get('/api/categories', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('/api/menu-items', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setStats({
                categories: categoriesRes.data.data.length,
                menuItems: menuItemsRes.data.data.length,
                orders: 0,
                pendingBookings: 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const statCards = [
        { icon: Tag, label: 'Total Categories', value: stats.categories, color: 'bg-blue-500' },
        { icon: Package, label: 'Total Menu Items', value: stats.menuItems, color: 'bg-red-500' },
        { icon: ShoppingCart, label: 'Total Orders', value: stats.orders, color: 'bg-green-500' },
        { icon: Clock, label: 'Pending Bookings', value: stats.pendingBookings, color: 'bg-yellow-500' },
    ];

    return (
        <div>
            {/* Welcome Message */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Hi {username}, Welcome! 👋
                </h1>
                {/* <p className="text-gray-600 mt-2">
                    Welcome to your restaurant admin dashboard. Manage your content, products, and settings from here.
                </p> */}
            </div>

            {/* Stats Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        {stat.label}
                                    </dt>
                                    <dd className="text-3xl font-semibold text-gray-900">
                                        {stat.value}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}

            {/* Quick Actions Card */}
            {/* <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Quick Actions
                </h2>
                <p className="text-gray-600 mb-4">
                    Get started by managing your menu categories and items. You can customize your website theme from the settings page.
                </p>
                <div className="flex gap-4">
                    <a
                        href="/categories"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Manage Categories
                    </a>
                    <a
                        href="/menu-items"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Manage Menu Items
                    </a>
                </div>
            </div> */}
        </div>
    );
}

export default Dashboard;