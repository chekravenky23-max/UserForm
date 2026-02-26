import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function UserForm() {
    const [formData, setFormData] = useState({
        name: '', age: '', phone: '', email: '', address: '', pincode: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post(`${API_URL}/users`, formData);
            setStatus({ type: 'success', message: 'Data submitted successfully!' });
            setFormData({ name: '', age: '', phone: '', email: '', address: '', pincode: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.error || 'An error occurred while submitting data.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-blue-900 mb-2">Provide Your Details</h2>
                <p className="text-gray-500">Please fill out the form below carefully.</p>
            </div>

            {status.message && (
                <div className={`p-4 mb-6 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input type="number" name="age" required min="1" max="150" value={formData.age} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="25" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="+1 234 567 8900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="john@example.com" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" required rows="3" value={formData.address} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="123 Main St, Apt 4B"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode / Zip Code</label>
                    <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange}
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="10001" />
                </div>

                <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors disabled:opacity-70">
                    {loading ? 'Submitting...' : 'Submit Details'}
                </button>
            </form>
        </div>
    );
}
