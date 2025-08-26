import { useSession, signIn } from "next-auth/react";
import Settings from '@/components/sidebar/settings';
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Button } from "@heroui/react";
import Image from 'next/image';
import { signOutAndClearCache } from '@/utils/auth'; // Import the custom signOut function
import { HiArrowLeft } from "react-icons/hi2";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const displayName = session?.user?.name?.replace(/\s*\([^)]*\)$/, '').trim();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  const currentUserId = session?.user?.hashedId || null;

  return (
    <div className="min-h-screen bg-teal-400 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8">
        <Link href="/"><HiArrowLeft /></Link>
        {session ? (
          <div className="text-center mb-8">
            <div className="flex justify-evenly items-center gap-3 mb-3">
              {session.user.image && (
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden border border-teal-400 shadow-[5px_5px_0px_0px_rgba(45,212,191)]">
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                    priority={true}
                  />
                </div>
              )}
              <div className="flex flex-col items-start gap-y-2">
                <p className="font-bold underline decoration-2 decoration-teal-400 text-gray-800 text-2xl">
                  {displayName || session.user.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user.email}
                </p>
                <div
                  onClick={signOutAndClearCache}
                  className="w-fit text-sm cursor-pointer text-gray-600 hover:text-red-400 transition-colors duration-300"
                >
                  Sign Out
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <Settings userId={currentUserId} />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-6 text-gray-800 dark:text-gray-200">
              You are not signed in. Please sign in to manage your RSS feeds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onPress={() => signIn("github")}
                size="lg"
                endContent={<FaGithub />}
                className="bg-gray-800 text-white"
              >
                Sign in with GitHub
              </Button>
              <Button
                onPress={() => signIn("google")}
                size="lg"
                endContent={<FaGoogle />}
                className="text-white bg-blue-600"
              >
                Sign in with Google
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}