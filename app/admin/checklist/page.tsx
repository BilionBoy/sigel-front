"use client";

import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Camera,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Search,
  ClipboardList,
  Car,
  Calculator,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TIPOS ---
type ItemStatus = "B" | "R" | "I" | "F" | null;

interface PhotoSlot {
  id: string;
  label: string;
  url: string | null;
  isMain: boolean;
  timestamp?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  status: ItemStatus;
  obs: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
  obsGeral: string;
}

interface CarroPendente {
  id: string;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
  dataEntrada: string;
  valorFipe: number;
}

// --- DADOS MOCKADOS ---
const MOCK_PENDING_CARS: CarroPendente[] = [
  {
    id: "1",
    modelo: "FIAT UNO MILLE 1.0",
    placa: "ABC-1234",
    ano: 2012,
    cor: "Branco",
    dataEntrada: "20/01/2026",
    valorFipe: 18000,
  },
  {
    id: "2",
    modelo: "VW GOL 1.6 MSI",
    placa: "XYZ-9876",
    ano: 2019,
    cor: "Prata",
    dataEntrada: "18/01/2026",
    valorFipe: 45000,
  },
];

const INITIAL_PHOTOS: PhotoSlot[] = [
  { id: "frente", label: "Frente (Capa)", url: null, isMain: true },
  { id: "traseira", label: "Traseira", url: null, isMain: false },
  { id: "lateral_esq", label: "Lateral Esquerda", url: null, isMain: false },
  { id: "lateral_dir", label: "Lateral Direita", url: null, isMain: false },
  { id: "motor", label: "Cofre do Motor", url: null, isMain: false },
  { id: "interior", label: "Interior", url: null, isMain: false },
];

const INITIAL_SECTIONS: ChecklistSection[] = [
  {
    id: "externo",
    title: "1. Estrutura Externa",
    obsGeral: "",
    items: [
      { id: "pintura", label: "Pintura Geral", status: null, obs: "" },
      { id: "capo", label: "Capô", status: null, obs: "" },
      { id: "parachoque", label: "Para-choques", status: null, obs: "" },
      { id: "farois", label: "Faróis / Lanternas", status: null, obs: "" },
    ],
  },
  {
    id: "mecanica",
    title: "2. Mecânica & Pneus",
    obsGeral: "",
    items: [
      { id: "motor", label: "Motor (Funcionamento)", status: null, obs: "" },
      { id: "bateria", label: "Bateria", status: null, obs: "" },
      { id: "pneus", label: "Pneus", status: null, obs: "" },
    ],
  },
  {
    id: "interior",
    title: "3. Interior",
    obsGeral: "",
    items: [
      { id: "bancos", label: "Estofamento", status: null, obs: "" },
      { id: "painel", label: "Painel", status: null, obs: "" },
    ],
  },
];

export default function ChecklistPage() {
  const [viewState, setViewState] = useState<"list" | "form">("list");
  const [selectedCar, setSelectedCar] = useState<CarroPendente | null>(null);

  // Estado do Checklist
  const [activeTab, setActiveTab] = useState("fotos"); // Começa pelas fotos
  const [photos, setPhotos] = useState<PhotoSlot[]>(INITIAL_PHOTOS);
  const [currentPhotoId, setCurrentPhotoId] = useState<string>("frente"); // Foto selecionada no visualizador
  const [sections, setSections] =
    useState<ChecklistSection[]>(INITIAL_SECTIONS);

  // Estados Finais
  const [classificacao, setClassificacao] = useState("");
  const [valorAvaliado, setValorAvaliado] = useState<number>(0);
  const [valorSugerido, setValorSugerido] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA DE SELEÇÃO ---
  const handleSelectCar = (car: CarroPendente) => {
    setSelectedCar(car);
    setPhotos(JSON.parse(JSON.stringify(INITIAL_PHOTOS)));
    setSections(JSON.parse(JSON.stringify(INITIAL_SECTIONS)));
    setViewState("form");
    setActiveTab("fotos");
  };

  // --- LÓGICA DE FOTOS (ESTILO MOBILE) ---
  const currentPhoto = photos.find((p) => p.id === currentPhotoId) || photos[0];

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      const now = new Date().toLocaleString();
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === currentPhotoId ? { ...p, url: fakeUrl, timestamp: now } : p,
        ),
      );

      // Auto-avance para a próxima foto vazia se houver
      const nextEmpty = photos.find((p) => !p.url && p.id !== currentPhotoId);
      if (nextEmpty) {
        setTimeout(() => setCurrentPhotoId(nextEmpty.id), 500);
      }
    }
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, url: null, timestamp: undefined } : p,
      ),
    );
  };

  // --- LÓGICA DO CHECKLIST (ESTILO LIMPO ANTERIOR) ---
  const handleItemChange = (
    sectionId: string,
    itemId: string,
    field: "status" | "obs",
    value: any,
  ) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item,
          ),
        };
      }),
    );
  };

  // Cálculo Simples
  const calcularSugestao = () => {
    if (!selectedCar) return;
    let penalidade = 0;
    sections.forEach((sec) => {
      sec.items.forEach((item) => {
        if (item.status === "R") penalidade += 0.05;
        if (item.status === "I") penalidade += 0.15;
        if (item.status === "F") penalidade += 0.1;
      });
    });
    const final = selectedCar.valorFipe * (1 - Math.min(penalidade, 0.9));
    setValorSugerido(Math.round(final));
    setValorAvaliado(Math.round(final)); // Auto-preenche

    if (penalidade < 0.2) setClassificacao("OCIOSO");
    else if (penalidade < 0.6) setClassificacao("RECUPERAVEL");
    else if (penalidade < 0.9) setClassificacao("ANTIECONOMICO");
    else setClassificacao("IRRECUPERAVEL");
  };

  const StatusSelector = ({
    status,
    onChange,
  }: {
    status: ItemStatus;
    onChange: (s: ItemStatus) => void;
  }) => (
    <div className="flex gap-1">
      {["B", "R", "I", "F"].map((s) => (
        <Button
          key={s}
          type="button"
          size="sm"
          variant={status === s ? "default" : "outline"}
          className={`w-8 h-8 p-0 font-bold ${
            status === s
              ? s === "B"
                ? "bg-green-600 hover:bg-green-700"
                : s === "R"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : s === "I"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-red-600 hover:bg-red-700"
              : "text-muted-foreground"
          }`}
          onClick={() => onChange(s as ItemStatus)}
        >
          {s}
        </Button>
      ))}
    </div>
  );

  // --- VIEW LISTA ---
  if (viewState === "list") {
    return (
      <AppShell
        title="Checklist & Vistorias"
        subtitle="Selecione um veículo para iniciar"
      >
        <Card>
          <CardHeader>
            <CardTitle>Fila de Vistoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por placa..." className="pl-9" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PENDING_CARS.map((car) => (
                  <TableRow
                    key={car.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSelectCar(car)}
                  >
                    <TableCell className="font-mono font-medium">
                      {car.placa}
                    </TableCell>
                    <TableCell>{car.modelo}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm">
                        <ClipboardList className="mr-2 h-4 w-4" /> Vistoriar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  // --- VIEW FORMULÁRIO ---
  return (
    <AppShell
      title="Realizar Vistoria"
      subtitle={`${selectedCar?.modelo} - ${selectedCar?.placa}`}
    >
      <div className="space-y-4">
        {/* Navegação Topo */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => setViewState("list")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <div className="text-sm text-muted-foreground">
            FIPE: R$ {selectedCar?.valorFipe.toLocaleString()}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] lg:grid-cols-4">
            <TabsTrigger value="fotos">
              <Camera className="h-4 w-4 mr-2" /> Fotos
            </TabsTrigger>
            <TabsTrigger value="externo">Externo</TabsTrigger>
            <TabsTrigger value="mecanica">Mecânica</TabsTrigger>
            <TabsTrigger value="conclusao">Finalizar</TabsTrigger>
          </TabsList>

          {/* --- ABA FOTOS (REFEITA BASEADA NO DESIGN MOBILE) --- */}
          <TabsContent value="fotos" className="mt-4">
            <div className="grid md:grid-cols-12 gap-6">
              {/* ÁREA CENTRAL (Visualizador) */}
              <div className="md:col-span-12 space-y-4">
                <Card className="overflow-hidden border-2 border-muted">
                  <div className="relative aspect-video bg-black/5 flex flex-col items-center justify-center">
                    {/* Visualização da Foto */}
                    {currentPhoto.url ? (
                      <img
                        src={currentPhoto.url}
                        alt={currentPhoto.label}
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground p-8">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>Nenhuma foto registrada para este ângulo</p>
                      </div>
                    )}

                    {/* Linhas de Grade (Grid Overlay) */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                      <div className="w-full h-1/3 border-b border-white/50 absolute top-0"></div>
                      <div className="w-full h-1/3 border-b border-white/50 absolute top-1/3"></div>
                      <div className="h-full w-1/3 border-r border-white/50 absolute left-0"></div>
                      <div className="h-full w-1/3 border-r border-white/50 absolute left-1/3"></div>
                    </div>
                  </div>

                  {/* Controles da Foto Atual */}
                  <CardContent className="p-4 bg-card border-t">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                          Ângulo Selecionado
                        </Label>
                        <h3 className="text-xl font-bold">
                          {currentPhoto.label}
                        </h3>
                        {currentPhoto.timestamp && (
                          <p className="text-xs text-muted-foreground">
                            Capturado em: {currentPhoto.timestamp}
                          </p>
                        )}
                      </div>

                      {currentPhoto.url && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeletePhoto(currentPhoto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Botão Shutter Gigante */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <Button
                      className="w-full h-14 text-lg rounded-full shadow-lg"
                      onClick={handleCaptureClick}
                    >
                      <Camera className="mr-2 h-6 w-6" />
                      {currentPhoto.url ? "Substituir Foto" : "Capturar Foto"}
                    </Button>
                  </CardContent>
                </Card>

                {/* GALERIA HORIZONTAL (Thumbnails) */}
                <div className="space-y-2">
                  <Label>Galeria do Veículo</Label>
                  <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setCurrentPhotoId(photo.id)}
                        className={cn(
                          "relative flex-shrink-0 w-24 h-24 rounded-lg border-2 cursor-pointer overflow-hidden transition-all",
                          currentPhotoId === photo.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-muted",
                          photo.url ? "bg-background" : "bg-muted/30",
                        )}
                      >
                        {photo.url ? (
                          <img
                            src={photo.url}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-xs text-muted-foreground p-1 text-center">
                            <Camera className="h-4 w-4 mb-1" />
                            {photo.label.split(" ")[0]}
                          </div>
                        )}
                        {/* Indicador de check */}
                        {photo.url && (
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setActiveTab("externo")}>
                Próximo: Checklist <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* --- ABAS DE CHECKLIST (ESTILO CLÁSSICO/LIMPO QUE VOCÊ GOSTOU) --- */}
          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Legenda Discreta */}
                  <div className="flex gap-4 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    <span>
                      <strong className="text-green-600">B</strong> = Bom
                    </span>
                    <span>
                      <strong className="text-yellow-600">R</strong> = Regular
                    </span>
                    <span>
                      <strong className="text-orange-600">I</strong> =
                      Imprestável
                    </span>
                    <span>
                      <strong className="text-red-600">F</strong> = Faltando
                    </span>
                  </div>

                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-4 items-start md:items-center border-b pb-4 last:border-0"
                    >
                      <div className="w-full md:w-1/3">
                        <Label className="text-base">{item.label}</Label>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusSelector
                          status={item.status}
                          onChange={(val) =>
                            handleItemChange(section.id, item.id, "status", val)
                          }
                        />
                      </div>
                      <div className="flex-grow w-full">
                        <Input
                          placeholder="Observações..."
                          value={item.obs}
                          className="h-9"
                          onChange={(e) =>
                            handleItemChange(
                              section.id,
                              item.id,
                              "obs",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setActiveTab(
                        section.id === "externo" ? "fotos" : "externo",
                      )
                    }
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                  </Button>
                  <Button
                    onClick={() => {
                      const idx = sections.findIndex(
                        (s) => s.id === section.id,
                      );
                      if (idx < sections.length - 1)
                        setActiveTab(sections[idx + 1].id);
                      else setActiveTab("conclusao");
                    }}
                  >
                    Próximo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}

          {/* --- ABA CONCLUSÃO --- */}
          <TabsContent value="conclusao" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" /> Resultado da Avaliação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/30 rounded border border-dashed flex justify-between items-center">
                  <div className="text-sm">
                    <p className="font-semibold">Cálculo de Depreciação</p>
                    <p className="text-muted-foreground">
                      Baseado nos itens R/I/F marcados.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={calcularSugestao}
                  >
                    Calcular Agora
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Classificação Final</Label>
                    <Select
                      value={classificacao}
                      onValueChange={setClassificacao}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OCIOSO">Ocioso</SelectItem>
                        <SelectItem value="RECUPERAVEL">Recuperável</SelectItem>
                        <SelectItem value="ANTIECONOMICO">
                          Antieconômico
                        </SelectItem>
                        <SelectItem value="IRRECUPERAVEL">
                          Irrecuperável
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor de Avaliação (Lance Inicial)</Label>
                    <Input
                      type="number"
                      value={valorAvaliado}
                      onChange={(e) => setValorAvaliado(Number(e.target.value))}
                      className="font-mono font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                      Sugestão: R$ {valorSugerido.toLocaleString()} (FIPE:{" "}
                      {selectedCar?.valorFipe.toLocaleString()})
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Salvar Rascunho</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Finalizar e Tornar
                  Apto
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
