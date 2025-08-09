import React, { useContext, useEffect, useState,useRef } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
const Sidebar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef(null);

    const { getUsers, users, selectedUser,
        setSelectedUser, unseenMessage, setUnseenMessage } = useContext(ChatContext)

    const { logout, onlineUsers } = useContext(AuthContext)
    const [input, setInput] = useState(false)
    const navigate = useNavigate()

    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers])



    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}>
            <div className='pb-5'>

                <div className="flex justify-between items-center">
                    <img src={assets.logo} alt="logo" className="max-w-40" />

                    <div className="relative py-2" ref={menuRef}>
                        <img
                            src={assets.menu_icon}
                            alt="menu"
                            className="max-h-5 cursor-pointer"
                            onClick={() => setMenuOpen((prev) => !prev)}
                        />

                        {menuOpen && (
                            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
                                <p
                                    onClick={() => {
                                        navigate("/profile");
                                        setMenuOpen(false);
                                    }}
                                    className="cursor-pointer text-sm"
                                >
                                    Edit Profile
                                </p>
                                <hr className="my-2 border-t border-gray-500" />
                                <p
                                    onClick={() => {
                                        logout();
                                        setMenuOpen(false);
                                    }}
                                    className="cursor-pointer text-sm"
                                >
                                    Logout
                                </p>
                            </div>
                        )}
                    </div>
                </div>



                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                    <img src={assets.search_icon} alt="search" className='w-3' />
                    <input onChange={(e) => setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search user...' />
                </div>
            </div>

            <div className='flex flex-col'>
                {
                    filteredUsers.map((user, index) => (
                        <div onClick={() => { setSelectedUser(user); setUnseenMessage(prev => ({ ...prev, [user._id]: 0 })) }} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                            <img src={user?.profilePic || assets.avatar_icon} alt="profile" className='w-[35px] aspect-[1/1] rounded-full object-cover object-[50%_0%]' />

                            <div className='flex flex-col leading-5'>
                                <p>{user.fullName}</p>
                                {
                                    onlineUsers.includes(user._id) ? <span className='text-green-400 text-xs'>Online</span> : <span className='text-neutral-400 text-xs'>Offline</span>
                                }
                            </div>
                            {
                                unseenMessage[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessage[user._id]}</p>
                            }

                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default Sidebar
