"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/lib/context/app-context";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye, Filter } from "lucide-react";
import type { CarroStatus } from "@/lib/types";
import Car from "@/components/icons/car";

export default function AdminCarsPage() {
  const { carros, addCarro } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // CORREÇÃO: Adicionados todos os campos que o formulário tenta acessar
  const [newCar, setNewCar] = useState({
    placa: "",
    chassi: "",
    renavam: "",
    ano: new Date().getFullYear(),
    cor: "",
    tipo: "",
    marca: "",
    modelo: "",
    valorInicial: 0,
    motor: "",
    tombamento: "",
    dataRecebimento: "",
    localRecebimento: "",
    proprietarioNome: "",
    proprietarioDocumento: "",
    status: "PENDENTE", // Valor inicial padrão
  });

  const filteredCarros = carros.filter((carro) => {
    const matchesSearch =
      carro.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carro.chassi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carro.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carro.modelo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || carro.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddCar = () => {
    addCarro({
      ...newCar,
      // Se quiser usar o status do form, use newCar.status as CarroStatus
      // Se quiser forçar APTO, mantenha como estava, mas cuidado com a lógica
      status: (newCar.status as CarroStatus) || ("APTO" as CarroStatus),
      fotos: ["/placeholder.svg?height=200&width=300"],
    });

    // Reseta o formulário com todos os campos
    setNewCar({
      placa: "",
      chassi: "",
      renavam: "",
      ano: new Date().getFullYear(),
      cor: "",
      tipo: "",
      marca: "",
      modelo: "",
      valorInicial: 0,
      motor: "",
      tombamento: "",
      dataRecebimento: "",
      localRecebimento: "",
      proprietarioNome: "",
      proprietarioDocumento: "",
      status: "PENDENTE",
    });
    setDialogOpen(false);
  };

  return (
    // CORREÇÃO: Removido requiredRole que causava erro
    <AppShell
      title="Carros Aptos"
      subtitle="Inventário de veículos disponíveis para leilão"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Inventário de Veículos</CardTitle>
              <CardDescription>
                {filteredCarros.length} veículos encontrados de {carros.length}{" "}
                total
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Carro Apto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
                {/* Adicionei overflow-y-auto para telas pequenas caso o form seja grande */}
                <DialogHeader>
                  <DialogTitle>Registro Administrativo de Veículo</DialogTitle>
                  <DialogDescription>
                    Cadastro inicial para controle interno e auditoria
                    (pré-leilão)
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  {/* BLOCO 1 — RECEBIMENTO */}
                  <section className="grid gap-4">
                    <h4 className="font-semibold">Recebimento do Bem</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataRecebimento">
                          Data e Hora de Recebimento
                        </Label>
                        <Input
                          id="dataRecebimento"
                          type="datetime-local"
                          value={newCar.dataRecebimento}
                          onChange={(e) =>
                            setNewCar({
                              ...newCar,
                              dataRecebimento: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="localRecebimento">
                          Local de Recebimento
                        </Label>
                        <Input
                          id="localRecebimento"
                          placeholder="Secretaria / Pátio / Local"
                          value={newCar.localRecebimento}
                          onChange={(e) =>
                            setNewCar({
                              ...newCar,
                              localRecebimento: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </section>

                  {/* BLOCO 2 — IDENTIFICAÇÃO DO VEÍCULO */}
                  <section className="grid gap-4">
                    <h4 className="font-semibold">Identificação do Veículo</h4>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="placa">Placa</Label>
                        <Input
                          id="placa"
                          placeholder="ABC-1234"
                          value={newCar.placa}
                          onChange={(e) =>
                            setNewCar({
                              ...newCar,
                              placa: e.target.value.toUpperCase(),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chassi">Chassi</Label>
                        <Input
                          id="chassi"
                          value={newCar.chassi}
                          onChange={(e) =>
                            setNewCar({
                              ...newCar,
                              chassi: e.target.value.toUpperCase(),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="renavam">Renavam</Label>
                        <Input
                          id="renavam"
                          value={newCar.renavam}
                          onChange={(e) =>
                            setNewCar({ ...newCar, renavam: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="marca">Marca</Label>
                        <Input
                          id="marca"
                          value={newCar.marca}
                          onChange={(e) =>
                            setNewCar({ ...newCar, marca: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="modelo">Modelo</Label>
                        <Input
                          id="modelo"
                          value={newCar.modelo}
                          onChange={(e) =>
                            setNewCar({ ...newCar, modelo: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ano">Ano</Label>
                        <Input
                          id="ano"
                          type="number"
                          value={newCar.ano}
                          onChange={(e) =>
                            setNewCar({
                              ...newCar,
                              ano: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cor">Cor</Label>
                        <Input
                          id="cor"
                          value={newCar.cor}
                          onChange={(e) =>
                            setNewCar({ ...newCar, cor: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motor">Motor</Label>
                        <Input
                          id="motor"
                          value={newCar.motor}
                          onChange={(e) =>
                            setNewCar({ ...newCar, motor: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tombamento">Tombamento</Label>
                        <Input
                          id="tombamento"
                          value={newCar.tombamento}
                          onChange={(e) =>
                            setNewCar({ ...newCar, tombamento: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </section>

                  {/* BLOCO 3 — PROPRIETÁRIO */}
                  <section className="grid gap-4">
                    <h4 className="font-semibold">Proprietário Registral</h4>

                    <div className="space-y-2">
                      <Label htmlFor="proprietarioNome">Nome Completo</Label>
                      <Input
                        id="proprietarioNome"
                        value={newCar.proprietarioNome}
                        onChange={(e) =>
                          setNewCar({
                            ...newCar,
                            proprietarioNome: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="proprietarioDocumento">CPF / CNPJ</Label>
                      <Input
                        id="proprietarioDocumento"
                        value={newCar.proprietarioDocumento}
                        onChange={(e) =>
                          setNewCar({
                            ...newCar,
                            proprietarioDocumento: e.target.value,
                          })
                        }
                      />
                    </div>
                  </section>

                  {/* BLOCO 4 — STATUS INICIAL */}
                  <section className="grid gap-2">
                    <Label>Status Inicial do Veículo</Label>
                    <Select
                      value={newCar.status}
                      onValueChange={(value) =>
                        setNewCar({ ...newCar, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                        <SelectItem value="IMPEDIDO">Impedido</SelectItem>
                        <SelectItem value="APTO">Apto</SelectItem>
                      </SelectContent>
                    </Select>
                  </section>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddCar}
                    disabled={!newCar.chassi || !newCar.marca || !newCar.modelo}
                  >
                    Registrar Veículo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por placa, chassi, marca ou modelo..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="APTO">Apto</SelectItem>
                  <SelectItem value="VINCULADO">Vinculado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">Foto</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead className="hidden md:table-cell">Chassi</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead className="hidden sm:table-cell">Ano</TableHead>
                  <TableHead className="hidden lg:table-cell">Cor</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    Valor Inicial
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCarros.map((carro) => (
                  <TableRow key={carro.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Image
                        src={
                          carro.fotos[0] ||
                          "/placeholder.svg?height=40&width=60"
                        }
                        alt={`${carro.marca} ${carro.modelo}`}
                        width={60}
                        height={40}
                        className="rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {carro.placa}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm text-muted-foreground">
                      {carro.chassi.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {carro.marca} {carro.modelo}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {carro.tipo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {carro.ano}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {carro.cor}
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      R$ {carro.valorInicial.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={carro.status} />
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/cars/${carro.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCarros.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum veículo encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
