'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Github, Linkedin, Mail, Code, Palette, Globe, Terminal, Star, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { RxVercelLogo } from "react-icons/rx";
import { DiMsqlServer } from "react-icons/di";
import { RiNextjsFill } from "react-icons/ri";
import { FaReact, FaAngular, FaJs, FaCss3Alt, FaNodeJs, FaHtml5, FaWindows   } from 'react-icons/fa';
import { SiCsharp, SiTypescript, SiTailwindcss, SiMongodb, SiShadcnui  } from "react-icons/si";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TypewriterText  from '@/components/typewriter'

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  languages_url: string;
  readme_url: string;
  stargazers_count: number;
  languages: { [key: string]: number };
  readme: string;
  deployURL: string;
  creacionFecha: string;
  topicos: string[];
}

const iconosLenguaje: Record<string, JSX.Element> = {
  javascript: <FaJs className="h-5 w-5 text-yellow-500" />,
  typescript: <SiTypescript className="h-5 w-4 text-blue-500" />,
  react: <FaReact className="h-5 w-5 text-blue-600" />,
  angular: <FaAngular className="h-5 w-5 text-red-600" />,
  csharp: <SiCsharp className="h-5 w-5 text-blue-600" />,
  html: <FaHtml5 className="h-5 w-5 text-orange-600" />,
  css:  <FaCss3Alt className="h-5 w-5 text-blue-600" />,
  tailwind: <SiTailwindcss className="h-5 w-5 text-blue-600" />,
  nodejs: <FaNodeJs className="h-5 w-5 text-green-600" />,
  mongodb: <SiMongodb className="h-5 w-5 text-green-600" />,
  nextjs: <RiNextjsFill className="h-5 w-5"/>,
  "shadcn-ui": <SiShadcnui className="h-4 w-4"/>
}; 

export default function Component() {
  const [darkMode, setDarkMode] = useState(false)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRepo, setExpandedRepo] = useState<number | null>(null)
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('https://api.github.com/users/ArzenLeib/repos?sort=updated', {
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch repositories')
        }
        const data: GitHubRepo[] = await response.json()
        
        const reposWithDetails = await Promise.all(
          data.map(async (repo) => {
            const [langResponse, detallesResponse, readmeResponse] = await Promise.all([
              fetch(repo.languages_url, {
                headers: {
                  'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
                }
              }),
              fetch(`https://api.github.com/repos/ArzenLeib/${repo.name}` ,{
                headers: {
                  'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
                }
              }),
              fetch(`https://api.github.com/repos/ArzenLeib/${repo.name}/readme` ,{
                headers: {
                  'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
                }
              })
            ])
            
            if (!langResponse.ok) {
              throw new Error(`Failed to fetch languages for ${repo.name}`)
            }
            const languages = await langResponse.json()

            let deployURL = ''
            let creacionFecha = ''
            let topicos: string[] = []

            if (detallesResponse.ok){
              const detallesRepo = await detallesResponse.json()
              deployURL = detallesRepo.homepage
              creacionFecha = detallesRepo.created_at
              topicos = detallesRepo.topics
            }

            console.log(topicos)
            let readme = ''
            if (readmeResponse.ok) {
              const readmeData = await readmeResponse.json()
              const Base64Decrip = Uint8Array.from(atob(readmeData.content), (c) => c.charCodeAt(0))
              const decodedContent = new TextDecoder('utf-8').decode(Base64Decrip)
              readme = decodedContent
            }
            
            return { ...repo, languages, readme, deployURL, creacionFecha, topicos }
          })
        )
        
        setRepos(reposWithDetails)
      } catch (err) {
        setError('Error fetching repositories. Please try again later.')
        console.error('Error fetching repos:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepos()
  }, [])

  const toggleReadme = (repoId: number) => {
    setExpandedRepo(expandedRepo === repoId ? null : repoId)
  }

  const habilidades = [
    { name: 'Winforms', level: 'Experto', stars: 5, icon: <FaWindows /> },
    { name: 'React', level: 'Intermedio', stars: 3, icon: <FaReact/> },
    { name: 'Next.Js', level: 'principiante', stars: 2, icon: <SiCsharp/> },
    { name: 'Angular', level: 'Intermedio', stars: 3, icon: <FaAngular/> },
    { name: 'TypeScript', level: 'Intermedio', stars: 3, icon: <SiTypescript/> },
    { name: 'JavaScript', level: 'Avanzado', stars: 4, icon: <FaJs/> },
    { name: 'C#', level: 'Avanzado', stars: 4, icon: <SiCsharp/> },
    { name: 'SQL Server', level: 'Avanzado', stars: 4, icon: <DiMsqlServer/> },
    { name: 'MongoDB', level: 'Intermedio', stars: 3, icon: <SiMongodb/> },
  ]

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Formulario enviado')
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-background to-secondary text-foreground">
        <header className="p-4 flex justify-between items-center backdrop-blur-sm bg-background/30 sticky top-0 z-10">
          <motion.h1 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            EA.
          </motion.h1>
          <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Cambiar modo oscuro</span>
          </Button>
        </header>

        <main className="container mx-auto px-4">
          <section className="py-20 flex-col">
            <motion.div
              initial={{ y: 50, opacity: 10 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className='text-left w-fit'>
                <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-300 leading-normal">
                  ¡Hola! Soy Eugenio Arzeno
                </h2>
                <div className="text-2xl mb-8">
                  <TypewriterText/>
                </div>
                <a href="/assets/CV_Arzeno_ Eugenio.pdf" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Descarga mi Curriculum
                </Button>
                </a>      
              </div>
            </motion.div>
          </section>

          <div className='flex justify-center items-center'>
            <motion.div initial={{ y: 50, opacity: 0 }}animate={{ y: 0, opacity: 1 }}transition={{ duration: 0.5}}>
            <Card className="h-full w-fit justify-self-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <h3 className="text-3xl font-semibold mb-4">Sobre mí</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl">
                    Soy un analista y desarrollador apasionado por la tecnología y la programación. Desde que comencé a aprender a programar, tengo un interés por la cración de aplicaciones web. Mi objetivo es crear experiencias de usuario agradables y optimizar el rendimiento de las aplicaciones.
                    <br /><br />
                    Me encanta resolver problemas de lógica y siempre estoy en la búsqueda de nuevas formas de mejorar mis habilidades. En mi tiempo libre, disfruto explorando nuevas tecnologías, trabajando en proyectos personales que me desafíen a aprender algo nuevo y hacer deporte.
                  </p>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>          

          <section className="py-20" aria-labelledby="skills-title">
            <motion.div initial={{ y: 50, opacity: 0 }}animate={{ y: 0, opacity: 1 }}transition={{ duration: 0.5}}>
              <h2 id="skills-title" className="text-3xl font-bold mb-8 text-center">Mis Habilidades</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habilidades.map((habilidad, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <div className="mr-2 h-4 w-4 text-xl"> 
                            {habilidad.icon}
                          </div>
                          {habilidad.name}
                        </span>
                        <Badge variant="secondary">{habilidad.level}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${i < habilidad.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="py-20 flex flex-col items-center" aria-labelledby="projects-title">
            <h2 id="projects-title" className="text-3xl font-bold mb-8 text-center">Mis Proyectos</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin"/>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-2 gap-6 max-w-6xl">
                {repos.filter((repo) => repo.name !== 'Portfolio').map((repo) => (
                  <motion.div
                    key={repo.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-muted">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Code className="h-6 w-6 mr-2 text-primary" />
                            <CardTitle>{repo.name}</CardTitle>
                            <p className='ml-3 text-sm font-thin'>Creación {new Date(repo.creacionFecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReadme(repo.id)}
                            aria-expanded={expandedRepo === repo.id}
                            aria-controls={`readme-${repo.id}`}
                          >
                            {expandedRepo === repo.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {expandedRepo === repo.id ? 'Ocultar README' : 'Mostrar README'}
                            </span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className='mt-2'>
                        <CardDescription>{repo.description || 'No hay una descripción disponible'}</CardDescription>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {Object.values(repo.topicos).map((top) => {
                              const icono = iconosLenguaje[top.toLowerCase()];
                              return icono ? (
                                <Badge key={top} variant="secondary" className="flex items-center gap-2">
                                  {icono}
                                  {top}
                                </Badge>
                              ) : (
                                <Badge key={top} variant="secondary">
                                  {top}
                                </Badge>
                              );
                            })}
                          {Object.keys(repo.languages).map((lang) => {
                            if (lang === 'Less') return null;
                            const icono = iconosLenguaje[lang.toLowerCase()];
                            return icono ? (
                              <Badge key={lang} variant="secondary" className="flex items-center gap-2">
                                {icono}
                                {lang}
                              </Badge>
                            ) : (
                              <Badge key={lang} variant="secondary">
                                {lang}
                              </Badge>
                            );
                          })}
                        </div>
                      </CardContent>
                      {expandedRepo === repo.id && (
                        <CardContent id={`readme-${repo.id}`}>
                          <div className="mt-4 p-4 bg-muted rounded-md overflow-auto max-h-96">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} className={"markdown"}>{repo.readme || 'No hay README disponible'}</ReactMarkdown>
                          </div>
                        </CardContent>
                      )}
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className='flex text-right gap-4'>
                        <Button variant="outline" size="sm" asChild>
                          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">Ver en GitHub <Github className="h-5 w-5"/></a>
                        </Button>
                        <Button variant="outline" size="sm" asChild className={!repo.deployURL ? 'hidden' : ''}>
                          <a href={repo.deployURL} target="_blank" rel="noopener noreferrer">Ver en Vercel <RxVercelLogo className="h-5 w-5"/></a>
                        </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section className="py-20" aria-labelledby="contact-title">
            <h2 id="contact-title" className="text-3xl font-bold mb-8 text-center">Contáctame</h2>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Envíame un mensaje</CardTitle>
                <CardDescription>Completa el formulario a continuación y me pondré en contacto contigo lo antes posible.</CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  action="https://formsubmit.co/arzenoeugenio@gmail.com" 
                  method="POST" 
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Nombre
                    </label>
                    <Input id="name" name="name" placeholder="Tu nombre" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Mensaje
                    </label>
                    <Textarea id="message" name="message" placeholder="Tu mensaje" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar mensaje
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="bg-muted text-muted-foreground py-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">2024 Eugenio Arzeno. Creado en Next.JS.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors duration-200">
                <a href='https://github.com/ArzenLeib' target="_blank" rel="noopener noreferrer"><Github className="h-5 w-5"/></a>
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors duration-200">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}