## decisiciones de ia 

prompt: Estoy haciendo un e-commerce con react y ts. Necesito una arquitectura de carpetas por capas que separe: tipos / servicios de datos / estado global (contexto) / ui(componentes)  / paginas. Yo ya tengo assets, components (layouts y ui), contexts, hook, pages, services, style, types. Crees que me falta alguna más? sugerime una mejora de estructura y explicame el porque y que va en cada una.

respuesta: 
types/ (contratos del dominio), 
services/ (único lugar que consume APIs/SDKs externos), 
contexts/ (estado global por dominio, usa types y services, nunca hace fetch directo ni define tipos), components/ (UI reutilizable, recibe datos por props, sin lógica de negocio compleja)
pages/ (pantallas completas que componen componentes + estado global). 
Además se menciona hooks/ como la interfaz de consumo del estado de los contexts — el lugar donde viven los custom hooks con guard (useCart, useAuth, etc.) que desacoplan a los componentes de la lógica interna de cada context.

src/
├── assets/
├── components/
│   ├── layout/
│   └── ui/
├── config/
├── constants/
├── contexts/
├── hooks/
├── utils/
├── pages/
├── routes/
├── schemas/
├── services/
├── store/          (opcional, si crece más allá de Context)
├── styles/
├── types/
└── App.tsx / main.tsx