import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// 💡 UI Imports for icons and animation
import { motion } from "framer-motion";
import { User, Mail, Lock, Calendar, Briefcase, Heart, Save, X } from "lucide-react"; 

const Profile = () => {
    const { user, backend_url, setUser, token, setToken } = useContext(AppContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [occupation, setOccupation] = useState("student");
    const [maritalStatus, setMaritalStatus] = useState("single");

    const navigate = useNavigate();

    // ✅ populate fields when user is available
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setAge(user.age || "");
            setOccupation(user.occupation || "student");
            setMaritalStatus(user.maritalStatus || "single");
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${backend_url}/api/auth/update`,
                { name, email, password, age, occupation, maritalStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token || localStorage.getItem("token")}`,
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success(data.message);

                // ✅ update context + localStorage with new user & token
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);

                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    // 💡 Helper component for consistent input styling with Lucide icons (PURELY VISUAL)
    // This is defined *inside* the main component to avoid breaking logic flow.
    const InputField = ({ label, type = "text", value, onChange, placeholder, Icon, children }) => (
        <div>
            {/* 💡 Label now uses flex for icon alignment */}
            <label className=" mb-2 text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Icon size={16} className="text-lime-400" />
                {label}
            </label>
            {children || (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    // 💡 Updated input styling for dark mode and focus
                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 
                               focus:outline-none focus:ring-2 focus:ring-lime-400 placeholder:text-zinc-500 transition duration-150"
                />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-800 pt-10">

            {/* 💡 Framer Motion Animation for the main container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto p-6 md:p-8"
            >
                {/* 💡 Header Styling */}
                <h1 className="text-4xl font-extrabold text-lime-400">Edit Profile</h1>
                <p className="text-zinc-400 mt-2 mb-6">
                    Check and Update your personal information below.
                </p>

                <form
                    onSubmit={submitHandler}
                    // 💡 Form styling changed to zinc-900 with shadow and rounded corners
                    className="bg-zinc-900 shadow-2xl rounded-xl p-6 md:p-8 mt-6 space-y-6 text-zinc-200 border border-zinc-700"
                >
                    {/* 💡 Grid layout for Name/Email/Password/Age */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name */}
                        <InputField 
                            label="Full Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter your name" 
                            Icon={User} 
                        />

                        {/* Email */}
                        <InputField 
                            label="Email Address" 
                            type="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter your email" 
                            Icon={Mail} 
                        />

                        {/* Password */}
                        <InputField 
                            label="New Password" 
                            type="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Leave blank to keep current password" 
                            Icon={Lock} 
                        />

                        {/* Age */}
                        <InputField 
                            label="Age" 
                            type="number"
                            value={age} 
                            onChange={(e) => setAge(e.target.value)} 
                            placeholder="Enter your age" 
                            Icon={Calendar} 
                        />
                    </div>

                    <div className=" pt-6">
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Occupation */}
                            <InputField label="Occupation" Icon={Briefcase}>
                                {/* 💡 Select styling uses same zinc colors and higher padding */}
                                <select
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-lime-400 appearance-none"
                                >
                                    <option value="student">Student</option>
                                    <option value="employed">Employed</option>
                                    <option value="unemployed">Unemployed</option>
                                </select>
                            </InputField>

                            {/* Marital Status */}
                            <InputField label="Marital Status" Icon={Heart}>
                                <select
                                    value={maritalStatus}
                                    onChange={(e) => setMaritalStatus(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-lime-400 appearance-none"
                                >
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                </select>
                            </InputField>
                        </div>
                    </div>

                    {/* Buttons - Side-by-Side Layout and Icons */}
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <button
                            type="submit"
                            // 💡 Added flex and icon for visual appeal
                            className="flex-1 flex justify-center items-center gap-2 font-semibold py-3 rounded-xl transition duration-200 bg-lime-400 text-zinc-900 hover:bg-lime-300 active:scale-[0.98] shadow-lg shadow-lime-500/30"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            // 💡 Secondary button styling with zinc colors
                            className="flex-1 flex justify-center items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
                        >
                            <X size={20} />
                            Cancel / Back
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;