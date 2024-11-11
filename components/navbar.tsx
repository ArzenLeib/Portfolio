"use client"

import { type SVGProps } from "react"
import { PiShareNetworkLight } from "react-icons/pi"
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useUser } from "@auth0/nextjs-auth0/client"

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export default function Navbar() {
  const { setTheme, theme } = useTheme()
  const { user, isLoading } = useUser()

  return (
    <TooltipProvider>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center bg-white dark:bg-black px-4 md:px-6 backdrop-blur z-50">
        <Sheet>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Menu de Navegación</span>
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Menu de Navegación</p>
            </TooltipContent>
          </Tooltip>
          <SheetContent side="left">
            <Link href="#" className="mr-6 flex items-center" prefetch={false}>
              <PiShareNetworkLight className="h-8 w-8" />
              <span className="ml-2 text-lg font-mono font-medium">Coloquio Redes</span>
            </Link>
            <nav className="mt-6">
              <ul className="space-y-4">
                {!isLoading && user && (
                  <>
                    <li>
                      <Link href="/crear-prompt" className="text-lg font-semibold hover:underline" prefetch={false}>
                        SetIA
                      </Link>
                    </li>
                    <li>
                      <Link href="crud-automatico" className="text-lg font-semibold hover:underline" prefetch={false}>
                        Crud
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  {!isLoading && (
                    <Link
                      href={user ? "/api/auth/logout" : "/api/auth/login"}
                      className="text-lg font-semibold hover:underline"
                      prefetch={false}
                    >
                      {user ? "Log Out" : "Log In"}
                    </Link>
                  )}
                </li>
                {user && (
                  <li>
                    <Avatar>
                      <AvatarImage src={user.picture ?? ""} alt="" />
                      <AvatarFallback>{user.nickname}</AvatarFallback>
                    </Avatar>
                  </li>
                )}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/" className="mr-6 hidden items-center lg:flex font-mono text-lg font-medium" prefetch={false}>
              <PiShareNetworkLight className="h-8 w-8" />
              <span className="ml-2 text-xl">SetIA</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Trabajo Práctico 4 Coloquio Redes Y Comunicaciones</p>
          </TooltipContent>
        </Tooltip>
        <nav className="ml-auto hidden lg:flex items-center gap-6">
          {!isLoading && user && (
            <>
              <Link
                href="/crear-prompt"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                SetIA
              </Link>
              <Link
                href="crud-automatico"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                CRUD
              </Link>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.picture ?? ""} alt="" />
                  <AvatarFallback>{user?.nickname}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
              <Link href={user ? "/api/auth/logout" : "/api/auth/login"}>
                {user ? (
                  <>
                    <CiLogout className="mr-2 font-bold" />
                    Log out
                  </>
                ) : (
                  <>
                    <CiLogin className="mr-2 font-bold" />
                    Log in
                  </>
                )}
              </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="ml-4"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              <span className="sr-only">Cambiar de Tema</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cambiar de Tema</p>
          </TooltipContent>
        </Tooltip>
      </header>
    </TooltipProvider>
  )
}