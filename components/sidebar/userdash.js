import { memo } from 'react';
import Settings from '@/components/sidebar/settings';
import Image from 'next/image';
import { signOutAndClearCache } from '@/utils/auth'; // Import the custom signOut function

const UserDashboard = memo(function UserDashboard({ session }) {
    const currentUserId = session?.user?.hashedId || null;
    const displayName = session?.user?.name?.replace(/\s*\([^)]*\)$/, '').trim();

    return (
        <div className="flex flex-col py-8 px-4 max-h-screen w-full">
            <UserInfo
                user={session.user}
                displayName={displayName}
                onSignOut={signOutAndClearCache} // Use the custom signOut function
            />
            <div className="py-6">
                <Settings userId={currentUserId} />
            </div>
        </div>
    );
});

const UserInfo = memo(function UserInfo({ user, displayName, onSignOut }) {
    return (
        <div className="flex justify-evenly items-center gap-3 mb-3">
            {user.image && (
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden border border-teal-400 shadow-[5px_5px_0px_0px_rgba(45,212,191)]">
                    <Image
                        src={user.image}
                        alt="User Avatar"
                        fill
                        className="object-cover"
                        priority={true}
                    />
                </div>
            )}
            <div className="flex flex-col gap-y-2">
                <p className="font-bold underline decoration-2 decoration-teal-400 text-gray-800 text-2xl">
                    {displayName || user.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                </p>
                <div
                    onClick={onSignOut}
                    className="w-fit text-sm cursor-pointer text-gray-600 hover:text-red-400 transition-colors duration-300"
                >
                    Sign Out
                </div>
            </div>
        </div>
    );
});

export default UserDashboard;