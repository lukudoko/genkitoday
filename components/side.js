import { useSession } from "next-auth/react";
import UserDashboard from '@/components/sidebar/userdash';
import { Spinner } from "@heroui/react";

export default function Sidebar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-full h-full p-6 flex items-center justify-center">
        <Spinner
          variant="wave"
          classNames={{
            wrapper: "w-full h-full",
            dots: "bg-teal-400 w-7 h-7 rounded-full mx-1",
          }}
        />
      </div>
    );
  }

  if (session) {
    return <UserDashboard session={session} />;
  }

  return (
    <div className="w-full h-full p-6 font-noto flex items-center justify-center">
      <p className="text-gray-500">Access denied. Please log in.</p>
    </div>
  );
}