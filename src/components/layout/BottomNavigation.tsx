
import { Home, Book, Search, Trophy, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  path: string;
  icon: JSX.Element;
  label: string;
}

const BottomNavigation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-parchment-light/90 backdrop-blur-md border-t border-parchment-dark/20 dark:bg-parchment-dark/90 dark:border-parchment-darker/30 shadow-lg">
      <div className="grid h-16 grid-cols-5 px-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200",
                isActive 
                  ? "text-ancient-gold" 
                  : "text-scripture-text/80 hover:text-ancient-gold dark:text-scripture-text/70"
              )}
            >
              <div className={cn(
                "mb-1 p-1.5 rounded-full transition-all duration-200",
                isActive && "bg-parchment-dark/20 dark:bg-parchment-dark/40"
              )}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
