import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "../../ChatTypes";

export function useHomeSession() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/sessions");

        if (res.status !== 200) {
          router.push("/");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Session error:", error);
        setError("An error occurred while fetching the session.");
      } finally {
        setLoading(false);
      }
    }

    void fetchSession();
  }, [router]);

  return { user, loading, error };
}
