
import { Home, Book, Search, Trophy, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavigationItem {
  name: string;
  path: string;
  icon: JSX.Element;
  label: string;
}

const BottomNavigation = () => {
  const { t } = useLanguage();
  
  const navigation: NavigationItem[] = [
    {
      name: "home",
      path: "/",
      icon: <Home className="h-5 w-5" />,
      label: t("nav.home")
    },
    {
      name: "read",
      path: "/read",
      icon: <Book className="h-5 w-5" />,
      label: t("nav.read")
    },
    {
      name: "search",
      path: "/search",
      icon: <Search className="h-5 w-5" />,
      label: t("nav.search")
    },
    {
      name: "ranking",
      path: "/ranking",
      icon: <Trophy className="h-5 w-5" />,
      label: t("nav.ranking")
    },
    {
      name: "profile",
      path: "/profile",
      icon: <User className="h-5 w-5" />,
      label: t("nav.profile")
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="grid h-14 grid-cols-5 px-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex flex-col items-center justify-center text-xs font-medium text-gray-600 hover:text-ancient-gold dark:text-gray-400 dark:hover:text-ancient-gold"
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
