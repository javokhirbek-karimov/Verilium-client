import React, { useEffect, useState } from "react";
import { withRouter } from "next/router";
import Link from "next/link";
import { Collapse } from "@mui/material";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  PeopleAlt,
  LocalMall,
  Forum,
  HeadsetMic,
} from "@mui/icons-material";

const menu_set = [
  { title: "Users",     icon: <PeopleAlt sx={{ fontSize: 18 }} />,  key: "users" },
  { title: "Perfumes",  icon: <LocalMall sx={{ fontSize: 18 }} />,  key: "perfumes" },
  { title: "Community", icon: <Forum sx={{ fontSize: 18 }} />,      key: "community" },
  { title: "CS",        icon: <HeadsetMic sx={{ fontSize: 18 }} />, key: "cs" },
];

const sub_menu_set: Record<string, { title: string; url: string }[]> = {
  Users:     [{ title: "List", url: "/_admin/users" }],
  Perfumes:  [{ title: "List", url: "/_admin/perfumes" }],
  Community: [{ title: "List", url: "/_admin/community" }],
  CS: [
    { title: "FAQ",    url: "/_admin/cs/faq" },
    { title: "Notice", url: "/_admin/cs/notice" },
  ],
};

const AdminMenuList = (props: any) => {
  const { router: { pathname } } = props;
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  useEffect(() => {
    const seg = pathname.split("/").filter(Boolean);
    // auto-open matching section
    const sectionMap: Record<string, string> = {
      users: "Users", perfumes: "Perfumes", community: "Community", cs: "CS",
    };
    const active = sectionMap[seg[1]] || "Users";
    setOpenMenus([active]);
  }, [pathname]);

  const toggle = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isSubActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <nav className={"admin-nav"}>
      {menu_set.map((item) => {
        const isOpen = openMenus.includes(item.title);
        const subs = sub_menu_set[item.title] ?? [];
        const sectionActive = subs.some((s) => isSubActive(s.url));

        return (
          <div key={item.title} className={"admin-nav__group"}>
            <button
              className={`admin-nav__item${sectionActive ? " active" : ""}`}
              onClick={() => toggle(item.title)}
            >
              <span className={"admin-nav__item-icon"}>{item.icon}</span>
              <span className={"admin-nav__item-label"}>{item.title}</span>
              <span className={"admin-nav__item-arrow"}>
                {isOpen ? <ExpandLessRoundedIcon sx={{ fontSize: 16 }} /> : <ExpandMoreRoundedIcon sx={{ fontSize: 16 }} />}
              </span>
            </button>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <div className={"admin-nav__subs"}>
                {subs.map((sub) => (
                  <Link href={sub.url} key={sub.url}>
                    <span className={`admin-nav__sub${isSubActive(sub.url) ? " active" : ""}`}>
                      {sub.title}
                    </span>
                  </Link>
                ))}
              </div>
            </Collapse>
          </div>
        );
      })}
    </nav>
  );
};

export default withRouter(AdminMenuList);
