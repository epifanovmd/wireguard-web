import {
  Calendar,
  Download,
  Edit,
  Grid,
  Heart,
  Home,
  List,
  Mail,
  Power,
  Search,
  Settings,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Chips,
  type ColumnDef,
  DatePicker,
  DateRangePicker,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Empty,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Pagination,
  Segmented,
  Select,
  SelectContent,
  SelectEmpty,
  SelectItem,
  SelectLoading,
  SelectTrigger,
  SelectValue,
  Spinner,
  Switch,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  ThemeToggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useModal,
} from "~@components/ui2";

// Mock API для демонстрации
const fetchCountries = (): Promise<string[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        "Russia",
        "USA",
        "China",
        "Germany",
        "France",
        "Japan",
        "UK",
        "Italy",
        "Canada",
        "Spain",
      ]);
    }, 1500);
  });
};

const fetchCities = (): Promise<string[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        "Moscow",
        "New York",
        "London",
        "Paris",
        "Tokyo",
        "Berlin",
        "Rome",
        "Toronto",
        "Madrid",
        "Beijing",
      ]);
    }, 2000);
  });
};

// Table demo data
type Transaction = {
  id: string;
  name: string;
  email: string;
  status: "paid" | "pending" | "failed";
  amount: number;
  date: string;
};

const statusVariant: Record<
  Transaction["status"],
  "success" | "warning" | "destructive"
> = {
  paid: "success",
  pending: "warning",
  failed: "destructive",
};

const tableData: Transaction[] = [
  {
    id: "001",
    name: "John Doe",
    email: "john@example.com",
    status: "paid",
    amount: 250,
    date: "2024-01-15",
  },
  {
    id: "002",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    amount: 150,
    date: "2024-01-16",
  },
  {
    id: "003",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "failed",
    amount: 350,
    date: "2024-01-17",
  },
  {
    id: "004",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "paid",
    amount: 420,
    date: "2024-01-18",
  },
  {
    id: "005",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "paid",
    amount: 180,
    date: "2024-01-19",
  },
  {
    id: "006",
    name: "Diana Prince",
    email: "diana@example.com",
    status: "pending",
    amount: 560,
    date: "2024-01-20",
  },
  {
    id: "007",
    name: "Edward Norton",
    email: "edward@example.com",
    status: "failed",
    amount: 90,
    date: "2024-01-21",
  },
  {
    id: "008",
    name: "Fiona Green",
    email: "fiona@example.com",
    status: "paid",
    amount: 730,
    date: "2024-01-22",
  },
];

const tableColumns: ColumnDef<Transaction>[] = [
  { accessorKey: "id", header: "ID", size: 60 },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const v = getValue<Transaction["status"]>();
      return (
        <Badge size="sm" variant={statusVariant[v]}>
          {v}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  { accessorKey: "date", header: "Date" },
];

export const UIPage = () => {
  const [buttonVariant, setButtonVariant] = useState<any>("default");
  const [inputValue, setInputValue] = useState("");
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [selectedTab, setSelectedTab] = useState("tab1");
  const [selectValue, setSelectValue] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [segmentedValue, setSegmentedValue] = useState("list");
  const [segmentedNav, setSegmentedNav] = useState("home");

  const modal = useModal();

  const variants = [
    "default",
    "primary",
    "secondary",
    "destructive",
    "success",
    "warning",
    "info",
    "outline",
    "ghost",
  ];

  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchCountries().then(setCountries);
    fetchCities().then(setCities);
  }, []);

  // Dynamic loading example
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([]);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);
  const [hasLoadedDynamic, setHasLoadedDynamic] = useState(false);

  const handleDynamicOpen = (open: boolean) => {
    if (open && !hasLoadedDynamic) {
      setIsLoadingDynamic(true);
      setTimeout(() => {
        setDynamicOptions([
          "Option A",
          "Option B",
          "Option C",
          "Option D",
          "Option E",
        ]);
        setIsLoadingDynamic(false);
        setHasLoadedDynamic(true);
      }, 1500);
    }
  };

  // Load on first open
  const [lazyOptions, setLazyOptions] = useState<string[]>([]);
  const [isLoadingLazy, setIsLoadingLazy] = useState(false);
  const [hasLoadedLazy, setHasLoadedLazy] = useState(false);

  const handleLazyOpen = (open: boolean) => {
    if (open && !hasLoadedLazy) {
      setIsLoadingLazy(true);
      setTimeout(() => {
        setLazyOptions([
          "Item 1",
          "Item 2",
          "Item 3",
          "Item 4",
          "Item 5",
          "Item 6",
        ]);
        setIsLoadingLazy(false);
        setHasLoadedLazy(true);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-1)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Star className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold">UI Library</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">
            Modern React UI Components
          </h2>
          <p className="text-sm text-muted-foreground">
            Полная библиотека компонентов на Radix UI, Tailwind CSS и CVA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Buttons</CardTitle>
              <CardDescription className="text-xs">
                Варианты и размеры
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {variants.map(variant => (
                  <Button key={variant} variant={variant as any} size="sm">
                    {variant}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button leftIcon={<Mail className="h-3.5 w-3.5" />} size="sm">
                  Icon
                </Button>
                <Button loading size="sm">
                  Loading
                </Button>
                <Button disabled size="sm">
                  Disabled
                </Button>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Icon Buttons
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <IconButton variant="default" size="sm" title="Heart">
                    <Heart size={14} />
                  </IconButton>
                  <IconButton variant="default" size="md" title="Edit">
                    <Edit size={16} />
                  </IconButton>
                  <IconButton variant="destructive" size="md" title="Delete">
                    <Trash2 size={16} />
                  </IconButton>
                  <IconButton variant="primary" size="md" title="Download">
                    <Download size={16} />
                  </IconButton>
                  <IconButton variant="enable" size="md" title="Enable">
                    <Power size={16} />
                  </IconButton>
                  <IconButton variant="disable" size="md" title="Disable">
                    <Power size={16} />
                  </IconButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inputs</CardTitle>
              <CardDescription className="text-xs">
                Текстовые поля
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Default input" size="sm" />
              <Input
                placeholder="With left icon"
                leftIcon={<Search className="h-4 w-4" />}
                size="sm"
              />
              <Input
                placeholder="Clearable input"
                clearable
                onClear={() => console.log("cleared")}
                size="sm"
              />
              <Input placeholder="Filled variant" variant="filled" size="sm" />
              <Input type="password" placeholder="Password" size="sm" />
              <Input placeholder="Loading..." loading size="sm" />
            </CardContent>
          </Card>

          {/* Tags & Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tags & Badges</CardTitle>
              <CardDescription className="text-xs">
                Метки и теги
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <Tag size="sm">Default</Tag>
                <Tag size="sm" variant="primary">
                  Primary
                </Tag>
                <Tag size="sm" variant="success">
                  Success
                </Tag>
                <Tag size="sm" variant="warning">
                  Warning
                </Tag>
                <Tag size="sm" variant="destructive">
                  Error
                </Tag>
                <Tag size="sm" variant="info">
                  Info
                </Tag>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge size="sm">5</Badge>
                <Badge size="sm" variant="primary">
                  99+
                </Badge>
                <Badge size="sm" variant="success">
                  New
                </Badge>
                <Badge size="sm" variant="destructive">
                  !
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Chips size="sm">Chip 1</Chips>
                <Chips size="sm" variant="primary">
                  Chip 2
                </Chips>
                <Chips size="sm" onRemove={() => {}}>
                  Removable
                </Chips>
              </div>
            </CardContent>
          </Card>

          {/* Switch & Checkbox */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Controls</CardTitle>
              <CardDescription className="text-xs">
                Switch и Checkbox
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                    size="sm"
                  />
                  <span className="text-xs">Small</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                    size="md"
                  />
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                    size="lg"
                  />
                  <span className="text-xs">Large</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={checkboxChecked}
                    onCheckedChange={checked =>
                      setCheckboxChecked(checked as boolean)
                    }
                    size="sm"
                  />
                  <span className="text-xs">Small</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={checkboxChecked}
                    onCheckedChange={checked =>
                      setCheckboxChecked(checked as boolean)
                    }
                    size="md"
                  />
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox indeterminate size="md" />
                  <span className="text-xs">Indeterminate</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tabs</CardTitle>
              <CardDescription className="text-xs">Вкладки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList variant="default" size="sm">
                  <TabsTrigger value="tab1" variant="default" size="sm">
                    Home
                  </TabsTrigger>
                  <TabsTrigger value="tab2" variant="default" size="sm">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="tab3" variant="default" size="sm">
                    Settings
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="tab1"
                  className="text-xs text-muted-foreground"
                >
                  Home content
                </TabsContent>
                <TabsContent
                  value="tab2"
                  className="text-xs text-muted-foreground"
                >
                  Profile content
                </TabsContent>
                <TabsContent
                  value="tab3"
                  className="text-xs text-muted-foreground"
                >
                  Settings content
                </TabsContent>
              </Tabs>
              <Tabs defaultValue="a">
                <TabsList variant="underline" size="sm">
                  <TabsTrigger value="a" variant="underline" size="sm">
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="b" variant="underline" size="sm">
                    Billing
                  </TabsTrigger>
                  <TabsTrigger value="c" variant="underline" size="sm">
                    Notifications
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Select */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select</CardTitle>
              <CardDescription className="text-xs">
                Выпадающие списки
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Выберите опцию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-2">
                <Select>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Фрукты" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Apple</SelectItem>
                    <SelectItem value="b">Banana</SelectItem>
                    <SelectItem value="c">Cherry</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Цвета" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Страны" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.length > 0 ? (
                      countries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectLoading>Loading countries...</SelectLoading>
                    )}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Города" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.length > 0 ? (
                      cities.map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectLoading>Loading cities...</SelectLoading>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select onOpenChange={handleDynamicOpen}>
                  <SelectTrigger size="sm" loading={isLoadingDynamic}>
                    <SelectValue placeholder="Load on Open" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingDynamic ? (
                      <SelectLoading />
                    ) : dynamicOptions.length > 0 ? (
                      dynamicOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectEmpty>No options available</SelectEmpty>
                    )}
                  </SelectContent>
                </Select>
                <Select onOpenChange={handleLazyOpen}>
                  <SelectTrigger size="sm" loading={isLoadingLazy}>
                    <SelectValue placeholder="Lazy Load" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingLazy ? (
                      <SelectLoading />
                    ) : lazyOptions.length > 0 ? (
                      lazyOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectEmpty>No items found</SelectEmpty>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Date Pickers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Date Pickers</CardTitle>
              <CardDescription className="text-xs">
                Выбор даты и диапазона
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <DatePicker value={date} onChange={setDate} size="sm" />
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                size="sm"
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pagination</CardTitle>
              <CardDescription className="text-xs">
                Навигация по страницам
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
                size="sm"
              />
            </CardContent>
          </Card>

          {/* Modal & Drawer */}
          <Card
            style={{ background: "var(--surface-2)" }}
            className="lg:col-span-2"
          >
            <CardHeader>
              <CardTitle className="text-base">Modal & Drawer</CardTitle>
              <CardDescription className="text-xs">
                Модальные окна и панели
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              {/* Default Modal */}
              <Modal>
                <Modal.Trigger asChild>
                  <Button size="sm">Default</Button>
                </Modal.Trigger>
                <ModalContent>
                  <ModalHeader>
                    <ModalTitle>Default Modal</ModalTitle>
                    <ModalDescription>
                      Standard modal with close on overlay
                    </ModalDescription>
                  </ModalHeader>
                  <div className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      Click outside or press ESC to close
                    </p>
                  </div>
                  <ModalFooter>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm">Confirm</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* Modal with pulse on overlay click */}
              <Modal>
                <Modal.Trigger asChild>
                  <Button size="sm" variant="secondary">
                    No Close
                  </Button>
                </Modal.Trigger>
                <ModalContent disableInteractOutside>
                  <ModalHeader>
                    <ModalTitle>Required Action</ModalTitle>
                    <ModalDescription>
                      Cannot be dismissed with overlay or ESC
                    </ModalDescription>
                  </ModalHeader>
                  <div className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      This modal cannot be closed by clicking overlay or ESC key
                    </p>
                  </div>
                  <ModalFooter>
                    <Modal.Close asChild>
                      <Button size="sm">Close</Button>
                    </Modal.Close>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* Scrollable Modal */}
              <Modal>
                <Modal.Trigger asChild>
                  <Button size="sm" variant="info">
                    Scrollable
                  </Button>
                </Modal.Trigger>
                <ModalContent scrollable size="lg">
                  <ModalHeader>
                    <ModalTitle>Long Content</ModalTitle>
                    <ModalDescription>
                      Scroll through the content
                    </ModalDescription>
                  </ModalHeader>
                  <ModalBody className="space-y-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Paragraph {i + 1}.
                      </p>
                    ))}
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm">Confirm</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* Top positioned modal */}
              <Modal>
                <Modal.Trigger asChild>
                  <Button size="sm" variant="success">
                    Top
                  </Button>
                </Modal.Trigger>
                <ModalContent position="top" size="sm">
                  <ModalHeader>
                    <ModalTitle>Top Modal</ModalTitle>
                    <ModalDescription>Positioned at the top</ModalDescription>
                  </ModalHeader>
                  <div className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      This modal slides from the top
                    </p>
                  </div>
                  <ModalFooter>
                    <Button size="sm">OK</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* Bottom positioned modal */}
              <Modal>
                <Modal.Trigger asChild>
                  <Button size="sm" variant="warning">
                    Bottom
                  </Button>
                </Modal.Trigger>
                <ModalContent position="bottom" size="sm">
                  <ModalHeader>
                    <ModalTitle>Bottom Modal</ModalTitle>
                    <ModalDescription>
                      Positioned at the bottom
                    </ModalDescription>
                  </ModalHeader>
                  <div className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      This modal slides from the bottom
                    </p>
                  </div>
                  <ModalFooter>
                    <Button size="sm">OK</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* Skeleton props on Modal.Content directly */}
              <Modal>
                <Modal.Trigger asChild>
                  <Button size="sm" variant="destructive">
                    Skeleton Delete
                  </Button>
                </Modal.Trigger>
                <Modal.Content
                  title="Delete item?"
                  description="This action cannot be undone."
                  confirmLabel="Delete"
                  confirmVariant="destructive"
                  onConfirm={() => new Promise(res => setTimeout(res, 1000))}
                  onCancel={() => {}}
                />
              </Modal>

              <Modal>
                <Modal.Trigger asChild>
                  <Button size="sm" variant="primary">
                    Skeleton with body
                  </Button>
                </Modal.Trigger>
                <Modal.Content
                  title="Edit profile"
                  description="Update your account information."
                  size="md"
                  confirmLabel="Save"
                  onConfirm={() => new Promise(res => setTimeout(res, 800))}
                  onCancel={() => {}}
                >
                  <p className="text-sm text-muted-foreground">
                    Form fields would go here as children.
                  </p>
                </Modal.Content>
              </Modal>

              {/* Global modal via useModal — skeleton props */}
              <Button
                size="sm"
                variant="warning"
                onClick={() =>
                  modal.openModal({
                    title: "Publish changes?",
                    description: "Your changes will be visible to all users.",
                    confirmLabel: "Publish",
                    confirmVariant: "warning",
                    onConfirm: () => new Promise(res => setTimeout(res, 800)),
                    onCancel: () => {},
                  })
                }
              >
                Global skeleton
              </Button>

              {/* Global modal — render prop for full control */}
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  modal.openModal({
                    size: "md",
                    content: ({ onClose }) => (
                      <>
                        <ModalHeader>
                          <ModalTitle>Custom Modal</ModalTitle>
                        </ModalHeader>
                        <ModalBody className="py-4">
                          <p className="text-sm text-muted-foreground">
                            Full control via render prop —{" "}
                            <code className="rounded bg-muted px-1">
                              content: ({"{ onClose }"}) =&gt; ...
                            </code>
                          </p>
                        </ModalBody>
                        <ModalFooter>
                          <Button variant="outline" size="sm" onClick={onClose}>
                            Close
                          </Button>
                        </ModalFooter>
                      </>
                    ),
                  })
                }
              >
                Global render prop
              </Button>

              {/* Default Drawer */}
              <Drawer>
                <Drawer.Trigger asChild>
                  <Button variant="outline" size="sm">
                    Default Drawer
                  </Button>
                </Drawer.Trigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Default Drawer</DrawerTitle>
                    <DrawerDescription>
                      Swipe down or click outside to close
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Drawer content with smooth slide animation.
                    </p>
                  </div>
                  <DrawerFooter>
                    <Drawer.Close asChild>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </Drawer.Close>
                    <Button size="sm">Submit</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              {/* Scrollable drawer */}
              <Drawer>
                <Drawer.Trigger asChild>
                  <Button variant="outline" size="sm">
                    Scrollable Drawer
                  </Button>
                </Drawer.Trigger>
                <DrawerContent className="max-h-[80vh]">
                  <DrawerHeader>
                    <DrawerTitle>Long Content</DrawerTitle>
                    <DrawerDescription>
                      Scrollable drawer content
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4 overflow-y-auto flex-1">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        Content item {i + 1}. Lorem ipsum dolor sit amet.
                      </p>
                    ))}
                  </div>
                  <DrawerFooter>
                    <Drawer.Close asChild>
                      <Button variant="outline" size="sm">
                        Close
                      </Button>
                    </Drawer.Close>
                    <Button size="sm">Submit</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>

          {/* Table */}
          <Card
            style={{ background: "var(--surface-2)" }}
            className="lg:col-span-2"
          >
            <CardHeader>
              <CardTitle className="text-base">Table</CardTitle>
              <CardDescription className="text-xs">
                TanStack Table — сортировка, выбор строк, пагинация
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Default + sorting + selection + pagination
                </p>
                <Table
                  data={tableData}
                  columns={tableColumns}
                  size="sm"
                  sorting
                  selection
                  pagination
                  pageSize={4}
                  onRowClick={row => console.log("clicked", row)}
                  caption="Recent transactions"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Striped variant
                </p>
                <Table
                  data={tableData}
                  columns={tableColumns}
                  size="sm"
                  variant="striped"
                  sorting
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Loading state
                </p>
                <Table data={[]} columns={tableColumns} size="sm" loading />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Empty state
                </p>
                <Table data={[]} columns={tableColumns} size="sm" />
              </div>
            </CardContent>
          </Card>

          {/* Card Variants */}
          <Card
            variant="default"
            padding="sm"
            style={{ background: "var(--surface-3)" }}
          >
            <CardHeader>
              <CardTitle className="text-sm">Default Card</CardTitle>
              <CardDescription className="text-xs">
                Standard card
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Surface level 3</p>
            </CardContent>
          </Card>

          <Card
            variant="elevated"
            padding="sm"
            style={{ background: "var(--surface-3)" }}
          >
            <CardHeader>
              <CardTitle className="text-sm">Elevated Card</CardTitle>
              <CardDescription className="text-xs">
                Enhanced shadow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Hover effect with surface
              </p>
            </CardContent>
          </Card>

          {/* Spinner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Spinner</CardTitle>
              <CardDescription className="text-xs">
                Загрузочные индикаторы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="xl" />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <Spinner variant="primary" label="Primary" />
                <Spinner variant="success" label="Success" />
                <Spinner variant="warning" label="Warning" />
                <Spinner variant="destructive" label="Error" />
                <Spinner variant="info" label="Info" />
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Empty State</CardTitle>
              <CardDescription className="text-xs">
                Состояния пустых данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Empty
                size="sm"
                icon="inbox"
                title="No messages"
                description="Start a conversation to see messages here"
                action={<Button size="sm">New Message</Button>}
              />
            </CardContent>
          </Card>

          {/* Empty Variants */}
          <Card
            style={{ background: "var(--surface-2)" }}
            className="lg:col-span-2"
          >
            <CardHeader>
              <CardTitle className="text-base">Empty Variants</CardTitle>
              <CardDescription className="text-xs">
                Разные варианты пустых состояний
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg">
                  <Empty
                    size="sm"
                    icon="search"
                    title="No results"
                    description="Try adjusting your search"
                  />
                </div>
                <div className="border rounded-lg">
                  <Empty
                    size="sm"
                    icon="package"
                    title="No orders"
                    description="Your order history is empty"
                    action={
                      <Button size="sm" variant="primary">
                        Shop Now
                      </Button>
                    }
                  />
                </div>
                <div className="border rounded-lg">
                  <Empty
                    size="sm"
                    icon="database"
                    title="No data"
                    description="Database is empty"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segmented */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segmented</CardTitle>
              <CardDescription className="text-xs">
                Сегментированные кнопки
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Default variant
                </p>
                <Segmented
                  value={segmentedValue}
                  onChange={setSegmentedValue}
                  size="sm"
                  options={[
                    {
                      label: "List",
                      value: "list",
                      icon: <List className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Grid",
                      value: "grid",
                      icon: <Grid className="h-3.5 w-3.5" />,
                    },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Primary variant
                </p>
                <Segmented
                  value={segmentedNav}
                  onChange={setSegmentedNav}
                  size="md"
                  variant="primary"
                  options={[
                    {
                      label: "Home",
                      value: "home",
                      icon: <Home className="h-4 w-4" />,
                    },
                    {
                      label: "User",
                      value: "user",
                      icon: <User className="h-4 w-4" />,
                    },
                    {
                      label: "Settings",
                      value: "settings",
                      icon: <Settings className="h-4 w-4" />,
                    },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  With disabled option
                </p>
                <Segmented
                  defaultValue="day"
                  size="sm"
                  variant="secondary"
                  options={[
                    { label: "Day", value: "day" },
                    { label: "Week", value: "week" },
                    { label: "Month", value: "month" },
                    { label: "Year", value: "year", disabled: true },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Outline variant
                </p>
                <Segmented
                  defaultValue="option1"
                  size="sm"
                  variant="outline"
                  options={[
                    { label: "Option 1", value: "option1" },
                    { label: "Option 2", value: "option2" },
                    { label: "Option 3", value: "option3" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Segmented Block */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segmented Block</CardTitle>
              <CardDescription className="text-xs">
                Полноразмерные варианты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Segmented
                defaultValue="all"
                size="md"
                block
                options={[
                  { label: "All", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
              <Segmented
                defaultValue="tab1"
                size="sm"
                variant="primary"
                block
                options={[
                  {
                    label: "Tab 1",
                    value: "tab1",
                    icon: <Calendar className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "Tab 2",
                    value: "tab2",
                    icon: <User className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "Tab 3",
                    value: "tab3",
                    icon: <Settings className="h-3.5 w-3.5" />,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Tooltip */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tooltip</CardTitle>
            <CardDescription className="text-xs">
              Всплывающие подсказки
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-3">
                Через пропс content
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Tooltip content="Default tooltip">
                  <Button size="sm">Default</Button>
                </Tooltip>
                <Tooltip
                  content="Dark tooltip"
                  contentProps={{ variant: "dark" }}
                >
                  <Button size="sm" variant="secondary">
                    Dark
                  </Button>
                </Tooltip>
                <Tooltip content="Top placement" contentProps={{ side: "top" }}>
                  <Button size="sm" variant="outline">
                    Top
                  </Button>
                </Tooltip>
                <Tooltip
                  content="Right placement"
                  contentProps={{ side: "right" }}
                >
                  <Button size="sm" variant="outline">
                    Right
                  </Button>
                </Tooltip>
                <Tooltip
                  content="Bottom placement"
                  contentProps={{ side: "bottom" }}
                >
                  <Button size="sm" variant="outline">
                    Bottom
                  </Button>
                </Tooltip>
                <Tooltip
                  content="Left placement"
                  contentProps={{ side: "left" }}
                >
                  <Button size="sm" variant="outline">
                    Left
                  </Button>
                </Tooltip>
                <Tooltip content="Delayed tooltip (500ms)" delayDuration={500}>
                  <Button size="sm" variant="ghost">
                    Delayed
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-3">
                Через sub-компоненты (скелет)
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton size="sm" variant="destructive">
                      <Trash2 size={14} />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>Удалить</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton size="sm" variant="primary">
                      <Download size={14} />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>Скачать файл</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton size="sm" variant="enable">
                      <Power size={14} />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent variant="dark">Включить</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs underline underline-offset-2 cursor-help text-muted-foreground">
                      Что это?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-48 text-center">
                    Подробное описание функции в несколько строк
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          <p>
            Modern UI Library • Built with React, Radix UI, Tailwind CSS, and
            CVA
          </p>
        </footer>
      </main>
    </div>
  );
};
