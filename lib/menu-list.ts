import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/home",
          label: "Ana Sayfa",
          active: pathname.includes("/home"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "İşlemler",
      menus: [
        {
          href: "/personel",
          label: "Personel",
          active: pathname.includes("/personel"),
          icon: SquarePen,
          submenus: []

        },
        {
          href: "/poliklinik",
          label: "Poliklinik",
          active: pathname.includes("/poliklinik"),
          icon: Bookmark,
          submenus: []
        },
        {
          href: "/kullanici",
          label: "Kullanıcı",
          active: pathname.includes("/kullanici"),
          icon: Tag,
          submenus: []
        }
      ]
    }
  ];
}
