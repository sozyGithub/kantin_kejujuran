import { useRouter } from "next/router";
import Link from "next/link";

function NavLink({ className, exact, href, ky, children }: any) {
  const { asPath } = useRouter();
  const isActive = exact ? asPath === href : asPath.startsWith(href);

  if (isActive) {
    className += " bg-sky-100";
    // className = className.replace('hover:bg-basis/[.2]', '').replace('text-basis', '')
  }

  return (
    <Link href={href}>
      <div className={className} key={ky}>
        {children}
      </div>
    </Link>
  );
}

export default NavLink;
