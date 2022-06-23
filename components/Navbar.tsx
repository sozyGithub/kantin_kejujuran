import { Button } from "@mantine/core";
import Link from "next/link";
import { Login, ShoppingCart } from "tabler-icons-react";

const Navbar = () => {
  return (
    <>
      <div className="hidden lg:block sticky top-0 z-50 p-4 border-b border-gray-300 w-full bg-white/70 backdrop-blur shadow-sm">
        <div className="lg:flex flex-row justify-between items-center max-w-6xl w-full mx-auto">
          <div>
            <Link href="/auth/login">
              <Button size="xs" variant="light" leftIcon={<Login size={15} />}>
                Masuk
              </Button>
            </Link>
          </div>
          <Link href="/">
            <a className="font-bold text-xl text-gray-600">Kantin Kejujuran</a>
          </Link>
          <div>
            <ShoppingCart />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
