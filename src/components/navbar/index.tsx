import logo from "@/assets/images/logo.svg";
import { navIcons, navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

interface navbarProps {
  className?: string;
}

export function Navbar({ className }: navbarProps) {
  return (
    <nav>
      <div className="">
        <Image src={logo} alt="logo" width={17} height={14} className="" />
        <p className=" font-bold">Claudio's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id}>
              <Link href={type}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="">
        {navIcons.map(({ id, img: iconSrc }) => (
          <Image
            key={id}
            src={iconSrc}
            alt="icon"
            width={20}
            height={20}
            className="icon-hover"
          />
        ))}
        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
}
