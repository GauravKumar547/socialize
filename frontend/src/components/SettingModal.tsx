import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Close, Edit } from '@mui/icons-material';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';
import { AuthContext } from '@/context/AuthContext';
import clientApi from '@/network/network';
import storage from '@/firebase';
import userProfilePlaceholder from '@/assets/userprofile.svg';
import userCoverPlaceholder from '@/assets/noCover.png';
import type { IUser } from '@/types';

interface ISettingModalProps {
    user: IUser;
    onClose: () => void;
}

interface IUpdateUserData {
    user_id: string;
    username?: string;
    description?: string;
    city?: string;
    from?: string;
    relationship?: number;
    profilePicture?: string;
    coverPicture?: string;
}

/**
 * Settings modal component for updating user profile information
 * @param {ISettingModalProps} props - The component props
 * @returns {JSX.Element} The SettingModal component
 */
const SettingModal: React.FC<ISettingModalProps> = ({ user, onClose }) => {
    const [profilePicInput, setProfilePicInput] = useState<File | null>(null);
    const [coverPicInput, setCoverPicInput] = useState<File | null>(null);
    const [username, setUsername] = useState<string>(user?.username || '');
    const [relationship, setRelationship] = useState<number>(user?.relationship || 1);
    const [userData, setUserData] = useState<IUser | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const cityRef = useRef<HTMLInputElement>(null);
    const fromRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchUser = useCallback(
        async (contextUpdate = false): Promise<void> => {
            if (!user?._id) return;

            try {

                const res = await clientApi.get<IUser>(`/users?user_id=${user._id}`);
                if (contextUpdate) {
                    dispatch({ type: 'LOGIN_SUCCESS', payload: res });
                    localStorage.setItem('user', JSON.stringify(res));
                }

                setUserData(res);
                if (res.relationship) {
                    setRelationship(res.relationship);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error('Failed to fetch user data');
            }
        },
        [dispatch, user]
    );

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const uploadToFirebase = async (file: File): Promise<string> => {
        const storageRef = ref(storage, `/files/${user._id}/${file.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        return await getDownloadURL(uploadTask.ref);
    };

    const updateProfile = async (): Promise<void> => {
        if (!user?._id) return;

        setIsUpdating(true);
        toast.loading('Updating profile...', { id: 'update-profile' });

        try {
            const data: IUpdateUserData = { user_id: user._id };

            // Validate and add fields
            if (username && username.length > 3) {
                data.username = username;
            } else {
                toast.error('Username must be at least 4 characters long');
                return;
            }

            if (descRef.current?.value?.trim()) {
                data.description = descRef.current.value.trim();
            }

            if (cityRef.current?.value?.trim()) {
                data.city = cityRef.current.value.trim();
            }

            if (fromRef.current?.value?.trim()) {
                data.from = fromRef.current.value.trim();
            }

            data.relationship = relationship;

            // Upload new images
            if (profilePicInput) {
                data.profilePicture = await uploadToFirebase(profilePicInput);
            }

            if (coverPicInput) {
                data.coverPicture = await uploadToFirebase(coverPicInput);
            }

            // Delete old images
            try {
                if (userData?.profilePicture && profilePicInput) {
                    const fileProfileRef = ref(storage, userData.profilePicture);
                    await deleteObject(fileProfileRef);
                }
            } catch (error) {
                console.warn('Could not delete old profile picture:', error);
            }

            try {
                if (userData?.coverPicture && coverPicInput) {
                    const fileCoverRef = ref(storage, userData.coverPicture);
                    await deleteObject(fileCoverRef);
                }
            } catch (error) {
                console.warn('Could not delete old cover picture:', error);
            }

            // Update user data
            await clientApi.put<IUser>(
                `/users/${user._id}`,
                data as unknown as Record<string, unknown>
            );

            await fetchUser(true);
            toast.success('Profile updated successfully!', { id: 'update-profile' });
            onClose();
            navigate('/');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile', { id: 'update-profile' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUsernameChange = (value: string): void => {
        if (value.includes(' ')) {
            toast.error('Spaces in username not allowed');
        } else {
            setUsername(value);
        }
    };

    const handleFileChange = (
        file: File | null,
        type: 'profile' | 'cover'
    ): void => {
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error('File size must be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            if (type === 'profile') {
                setProfilePicInput(file);
            } else {
                setCoverPicInput(file);
            }
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-social-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <Close className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                    {/* Cover and Profile Pictures */}
                    <div className="relative mb-8">
                        {/* Cover Photo */}
                        <div className="relative h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg overflow-hidden">
                            <img
                                src={
                                    coverPicInput
                                        ? URL.createObjectURL(coverPicInput)
                                        : userData?.coverPicture || userCoverPlaceholder
                                }
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            <input
                                type="file"
                                onChange={(ev) => handleFileChange(ev.target.files?.[0] || null, 'cover')}
                                id="coverPic"
                                accept="image/*"
                                className="hidden"
                            />
                            <label
                                htmlFor="coverPic"
                                className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full cursor-pointer transition-all duration-200"
                            >
                                <Edit className="w-4 h-4 text-gray-600" />
                            </label>
                        </div>

                        {/* Profile Picture */}
                        <div className="absolute -bottom-8 left-6">
                            <div className="relative">
                                <img
                                    src={
                                        profilePicInput
                                            ? URL.createObjectURL(profilePicInput)
                                            : userData?.profilePicture || userProfilePlaceholder
                                    }
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-social object-cover"
                                />
                                <input
                                    type="file"
                                    onChange={(ev) => handleFileChange(ev.target.files?.[0] || null, 'profile')}
                                    id="profilePic"
                                    accept="image/*"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="profilePic"
                                    className="absolute bottom-0 right-0 p-1.5 bg-primary-600 hover:bg-primary-700 rounded-full cursor-pointer transition-colors duration-200"
                                >
                                    <Edit className="w-3 h-3 text-white" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(ev) => handleUsernameChange(ev.target.value)}
                                placeholder="Your username"
                                className="input-field border-gray-300 border p-2 w-full rounded"
                                minLength={4}
                                required
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                ref={descRef}
                                id="desc"
                                rows={3}
                                defaultValue={userData?.description || ''}
                                placeholder="Tell us about yourself..."
                                className="input-field resize-none border-gray-300 border p-2 w-full rounded"
                            />
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    ref={cityRef}
                                    type="text"
                                    id="city"
                                    defaultValue={userData?.city || ''}
                                    placeholder="Your city"
                                    className="input-field border-gray-300 border p-2 w-full rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <input
                                    ref={fromRef}
                                    type="text"
                                    id="from"
                                    defaultValue={userData?.from || ''}
                                    placeholder="Your country"
                                    className="input-field border-gray-300 border p-2 w-full rounded"
                                />
                            </div>
                        </div>

                        {/* Relationship Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Relationship Status
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { value: 1, label: 'Single' },
                                    { value: 2, label: 'Married' },
                                    { value: 3, label: 'In a relationship' },
                                ].map((option) => (
                                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="relationship"
                                            value={option.value}
                                            checked={relationship === option.value}
                                            onChange={() => setRelationship(option.value)}
                                            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                        disabled={isUpdating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={updateProfile}
                        className="btn-primary disabled:opacity-50"
                        disabled={isUpdating || !username || username.length < 4}
                    >
                        {isUpdating ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingModal; 