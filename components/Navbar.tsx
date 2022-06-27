import { Avatar, Badge, Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Login, ShoppingCart } from "tabler-icons-react";

const Navbar = (props: any) => {
  const { data: session }: any = useSession();
  return (
    <>
      <div className="block sticky top-0 z-50 p-4 border-b border-gray-300 w-full bg-white/70 backdrop-blur shadow-sm">
        <div className="lg:flex-row flex space-y-2 lg:space-y-0 flex-col justify-center lg:justify-between items-center max-w-6xl w-full mx-auto">
          <div>
            {!session ? (
              <Link href="/auth/login">
                <Button
                  size="xs"
                  variant="light"
                  leftIcon={<Login size={15} />}
                >
                  Masuk
                </Button>
              </Link>
            ) : (
              <Link href={`/student/${session?.user?.student_id}`}>
                <div className="flex flex-row space-x-2 items-center bg-sky-100 px-2 py-1 rounded-md shadow hover:bg-sky-200 cursor-pointer">
                  <Avatar radius="xl" color="sky" />
                  <p>{session?.user?.student_id}</p>
                </div>
              </Link>
            )}
          </div>
          <Link href="/">
            <a className="font-bold text-xl text-gray-600">Kantin Kejujuran</a>
          </Link>
          <div className="flex flex-row items-center">
            <Link
              href={
                session
                  ? `/student/${session?.user?.student_id}/cart`
                  : `/auth/login`
              }
            >
              <ShoppingCart className="cursor-pointer" />
            </Link>
            {props.quantity > 0 && (
              <Badge variant="light">{props.quantity}</Badge>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
