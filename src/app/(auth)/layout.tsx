import { Logo } from "@/components/Logo";
import { ToastProvider } from "@/components/ui";

function Skyline() {
  return (
    <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
      <g fill="#3F55B8">
        <rect x="40" y="60" width="4" height="60" />
        <rect x="30" y="118" width="24" height="40" />
        <rect x="18" y="150" width="48" height="60" />
        <rect x="0" y="200" width="120" height="320" />
        <rect x="230" y="330" width="170" height="190" />
        <rect x="215" y="350" width="30" height="170" />
        <rect x="290" y="300" width="18" height="40" />
        <rect x="330" y="300" width="18" height="40" />
        <rect x="370" y="300" width="18" height="40" />
      </g>
    </svg>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-[340px]">
            <Logo className="mb-10 lg:hidden" />
            {children}
          </div>
        </main>
        <aside className="bg-primary-radial relative hidden w-[35%] min-w-[380px] items-center justify-center overflow-hidden lg:flex">
          <Skyline />
          <Logo light size="lg" className="relative" />
        </aside>
      </div>
    </ToastProvider>
  );
}
