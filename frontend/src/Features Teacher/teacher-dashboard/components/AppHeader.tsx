import { ChevronDownIcon } from "./Icons";

interface AppHeaderProps {
  active: "dashboard" | "courses" | "qa-reports";
  userName: string;
  onDashboard: () => void;
  onMyCourses: () => void;
  onQAReports: () => void;
}

export function AppHeader({
  active,
  userName,
  onDashboard,
  onMyCourses,
  onQAReports,
}: AppHeaderProps) {
  return (
    <header className="td-header">
      <div className="td-header__inner">
        {/* Logo placeholder: the Figma frame has a blank 180x50 box here. */}
        <div className="td-logo" aria-hidden="true" />

        <nav className="td-menubar" aria-label="Main">
          <button
            type="button"
            className={`td-menubar__item${active === "dashboard" ? " is-active" : ""}`}
            aria-current={active === "dashboard" ? "page" : undefined}
            onClick={onDashboard}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`td-menubar__item${active === "courses" ? " is-active" : ""}`}
            aria-current={active === "courses" ? "page" : undefined}
            onClick={onMyCourses}
          >
            My Courses
          </button>
          <button
            type="button"
            className={`td-menubar__item${active === "qa-reports" ? " is-active" : ""}`}
            aria-current={active === "qa-reports" ? "page" : undefined}
            onClick={onQAReports}
          >
            Q&A / Report
          </button>
        </nav>

        <div className="td-user">
          <span className="td-avatar" aria-hidden="true">
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="td-user__name">{userName}</span>
          <ChevronDownIcon size={12} aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
