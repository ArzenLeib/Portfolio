'use client'

import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LuSendHorizonal } from "react-icons/lu";
import { FiInfo } from "react-icons/fi";
import { BsDownload } from "react-icons/bs";
import { TfiReload } from "react-icons/tfi";
import { IoMdArrowBack } from "react-icons/io";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

type DataItem = Record<string, string | number | boolean>;

const TableComponent = <T extends DataItem>({ data }: { data: T[] }) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);
  const [titleRow, ...dataRows] = data;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>{titleRow[header]}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataRows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {headers.map((header, cellIndex) => (
              <TableCell key={cellIndex}>{String(row[header])}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const CrearPrompt = () => {
  const [mensaje, setMensaje] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [sheetCargado, setSheetCargado] = useState(false);
  const [datosSheet, setDatosSheet] = useState([])
  const [hojasSheet, setHojasSheet] = useState([])
  const [tituloSheet, setTituloSheet] = useState('');

  const { user, isLoading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  const cargarSpreadSheet = async () => {
    try {
      const response = await fetch('/api/cargar-sheet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            spreadsheetId: sheetId,
            range: '',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos de la hoja');
      }

      const data = await response.json();
      setDatosSheet(data.sheetData);
      setHojasSheet(data.sheetNames);
      setTituloSheet(data.fileName)
      setSheetCargado(true);
    } catch (error) {
      console.error('Error al cargar los datos de la hoja:', error);
    }
  };

  const seleccionDeHoja = async (hojaSeleccionada: string) => {
    try {
      const response = await fetch('/api/cargar-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: sheetId,
          range: hojaSeleccionada,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al cargar los datos de la hoja');
      }
  
      const data = await response.json();
      setDatosSheet(data.sheetData);
    } catch (error) {
      console.error('Error al cargar los datos de la hoja:', error);
    }
  };

  return (
    <section className="w-full max-w-full flex-start flex-col sm:flex-row dark:bg-gray-900 mt-14">
      <div className="flex flex-start flex-col w-full sm:max-w-80 h-fit sm:h-screen ml-0 items-start justify-start bg-gray-100 dark:bg-gray-950" style={{ maxHeight: "calc(100vh - 56px)" }}>
        <div className='sm:ml-5 sm:flex flex-col hidden '>
          <h1 className='head_text text-left mb-2'> 
            <span className='head_gradient'>
            CRUD
            </span>  
          </h1>
          <p className='p_text text-gray-600 dark:text-gray-300 bg'> 
            ¡Usa Google Sheets como tu propia base de datos!
          </p>
        </div>

        <div className={`align-middle w-full mx-auto flex items-center justify-center gap-1 p-4 h-auto ${sheetCargado ? 'hidden' : ''}`}>
          <Input
            id="IdSheet"
            type="text"
            placeholder="ID Google Sheets"
            className='max-w-xs'
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button className="button_gradient rounded-full" disabled={!sheetId.trim()} onClick={cargarSpreadSheet}>
                    <BsDownload />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{!sheetId.trim() ? "El campo está vacío" : "Cargar Sheet"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className={`align-middle w-full mx-auto flex items-center justify-center gap-1 p-4 h-auto ${!sheetCargado ? 'hidden' : ''}`}>
          <TooltipProvider>
            <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button className="button_gradient rounded-full" onClick={() => setSheetCargado(false)}>
                        <IoMdArrowBack />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cargar otro SpreadSheet</p>
                  </TooltipContent>
                </Tooltip>
                <Select onValueChange={seleccionDeHoja}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Selecciona una Hoja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    {hojasSheet.map((hoja, index) => (
                      <SelectItem key={index} value={hoja}>
                        {hoja}
                      </SelectItem>
                    ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button className="button_gradient rounded-full" onClick={cargarSpreadSheet}>
                        <TfiReload />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Actualizar Sheet</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          </div>
          <div className= {`align-middle w-full mx-auto flex items-center justify-center gap-1 p-4 h-auto ${!sheetCargado ? 'hidden' : ''}`}>
          </div>
        </div>

      <div className="w-full sm:max-w-3xl mx-auto items-center">
        <div className="flex flex-col w-full h-screen max-w-[3000px] overflow-x-auto items-center justify-center gap-1 bg-white dark:bg-gray-900" style={{ maxHeight: "calc(100vh - 56px)" }}>
          <div id="chat" className="overflow-y-auto h-auto bg-white dark:bg-gray-900 w-full flex-1">
            {sheetCargado && datosSheet.length > 0 && (
              <TableComponent data={datosSheet} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CrearPrompt