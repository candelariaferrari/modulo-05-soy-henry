## types/: contratos del dominio  (definen la estructura (“shape”) y significado de las entidades fundamentales.)
Si una parte del sistema necesita crear o consumir datos —como un producto, un usuario o un ítem del carrito— aquí encuentra estructuras consistentes. Esto permite que los datos mantengan el mismo formato en toda la aplicación.

## services/: acceso a datos  
Contiene las funciones que interactúan con APIs, almacenamiento o mocks. Si cambia la fuente de datos, el ajuste se realiza en esta capa sin afectar al resto del sistema.

## contexts/: estado global  y la lógica de orquestación.  
Define qué datos están disponibles en la aplicación y cómo se actualizan, evitando pasar información manualmente entre múltiples componentes.
viven los contexts y providers: estructuras que comparten datos y acciones a nivel global para los distintos dominios.
Un archivo típico de context incluye el Provider y expone datos y funciones, pero nunca define los tipos ni hace fetchs directos; consume el contrato de types/ y se apoya en los services/. De esta manera, separa responsabilidades y permite a la UI interactuar con estados complejos sin duplicar lógica.

## components/: UI reutilizable  
Son piezas independientes (como botones o cards) que reciben datos por props y no contienen lógica de negocio compleja.

## pages/: pantallas por ruta
pantallas completas de la aplicación. Organiza componentes, consume estado global y estructura la navegación entre vistas.

## hooks: lógica de consumo de estado que actúa como interfaz de consumo del estado 
permite que los componentes accedan a la lógica definida en los contextos de forma más simple y desacoplada

## El patrón AppProviders:
es componer todos los providers en un solo componente, típicamente llamado AppProviders
Este componente se encarga de orquestar el árbol de Providers, definiendo un único punto de composición y declaración del orden.
1. Los providers de cada dominio se importan y se anidan dentro de AppProviders.
2. El único lugar que "sabe" cómo se orquesta el árbol es AppProviders.
3. En el entrypoint (main.tsx o en algún layout base), simplemente envolvés tu app con <AppProviders>.

Agregar o quitar providers requiere modificar sólo un archivo (AppProviders.tsx). Navegar y entender la composición lleva segundos.

main.tsx -> AppProvider -> ProductsProvider -> CartProvider -> App

## Orden de los providers
- Un provider que depende de otro debe estar anidado DENTRO del que le provee datos.
(si ProductsProvider necesita información del usuario autenticado (que provee AuthProvider), debe estar envuelto por AuthProvider)

## Antipatrón que debes evitar: Nunca mezcles providers en los mismos archivos de UI (ej. montar un Provider sólo en cierta página). Eso lleva a bugs por contexts faltantes y dificulta el testing.


## SHAPE -> significa que campos y funciones tiene ese estado. 
en cartContext seria a modo de ejemplo {items, total, addItem, removeItem}

1) ¿Por qué en un proyecto que crece (como este e-commerce) conviene separar el código en capas (types, services, contexts, components, pages) en vez de mezclar todo? ¿Qué regla de dependencia existe entre esas capas?
conviene separarlos en capas porque la regla de dependencias es en descentende o sea que las capas (archivos) superiores nunca son modificados por los inferiores. Lo que da mas escalabilidad al proyecto, encontrar mas facilmente donde se encuentra un problema, mejor para realizar los testing tener las funcionalidades bien modularizadas. 

2) ¿Qué problema concreto genera un AppContext monolítico (un solo context con todo el estado) y cómo lo resuelve separar los contexts por dominio (AuthContext, CartContext, ProductsContext)?
lo que genera el AppContext monolítico es un acoplamiento cruzado y re renders de las pantallas que consume ese context. La solución cuando se separan es porque cada uno tiene su shape tipado (no entendi muy bien que es shape) apoyandose en services donde recibimos la información y en types donde generamos los contratos de dominio asi solamente el arbol de providers importa solo si hay dependencia directa entre los dominios 

3) ¿Qué pasa si usás useContext directamente en un componente sin pasar por un custom hook, y el componente queda fuera de su Provider? ¿Cómo soluciona esto el patrón de "hook con guard"?
creo que lo que pasa es que si no pasa por custom hook devuevle un undefine, encambio si usamos el custom hook que cada hook envuelve el useContext puede devolver un error explicito (escrito por nosotros) si se usa fuera de su provider


4) ¿Qué es el "Provider Hell" y cómo lo resuelve el patrón AppProviders? ¿Cuál es la regla para decidir el orden de los providers?
Provider Hell es anidar todos los providers en main , lo resuelve AppProviders que es un unico componente que centraliza todos los providers y asi el entrypoint solo envuelve AppProviders -> App y la regla de orden: un provider que depende de datos de otro va anidado DENTRO del que le provee esos datos (el de base envuelve primero)

5) Explicá por qué definir value={{ cart, addItem }} directamente en el JSX de un Provider puede causar re-renders innecesarios en TODOS los componentes que lo consumen, aunque los datos no hayan cambiado. ¿Cómo se soluciona?
Eso pasa porque el JSX crea un objeto nuevo en cada render, entonces por ejemplo si ese value esta llamado en varios componentes se va a renderizar cada vez que sea llamado aunque el dato no cambio, se soluciona con useMemo para el value y useCallback para las funciones internas (si no se rompe las memorizaciones del objeto) .
useMemo(() => ({cart, addItem}), [cart, addItem]) soluciona esto: solo crea un objeto nuevo cuando cart o addItem realmente cambiaron.

6) ¿Cuál es la diferencia entre useMemo y useCallback en el contexto de estabilizar el value de un Context? ¿Por qué a veces conviene NO memoizar?
**useMemo** memoiza un valor cualquiera (puede ser un objeto, un array, un número calculado). Se usa para el value completo del context: useMemo(() => ({cart, addItem, removeItem}), [deps]).

**useCallback** es en realidad un caso particular de useMemo pero específico para memoizar funciones: useCallback(fn, deps) es equivalente a useMemo(() => fn, deps).

¿Por qué hacen falta los dos juntos? Porque si addItem se redefine en cada render (una función nueva cada vez, aunque haga lo mismo), entonces aunque memorices el objeto value con useMemo, su dependencia addItem cambia de referencia en cada render y el useMemo se "rompe" (se recalcula igual). Por eso primero se estabilizan las funciones con useCallback, y recién ahí el useMemo del value puede detectar correctamente que nada cambió.

**¿Cuándo NO conviene memoizar?** Cuando el context se usa en pocos lugares, el value es un dato primitivo (un string, un boolean) o la lógica es trivial — memoizar tiene su propio costo (memoria, complejidad de código) y sin consumidores sensibles a re-renders, ese costo no se paga con ningún beneficio real. Es optimización prematura si no hay evidencia de que haga falta.

7) En el enfoque "AI-Driven" que propone la lectura, ¿cuál es el rol que debería tener la IA en decisiones de arquitectura, y cuál debería ser siempre el rol del desarrollador?
la Ia tiene que ser el copiloto y nosotros los que los manejamos, siempre utilizar la ia en modo de asistente no del que decida que se va a utilizar. El desarrollador tiene que ver las opciones que la ia le propone respondiendo un prompt bien estrucutrado con texto , evicencias, que no se puede utilizar y que si se puede utilizar y siempre eligiendo la respuesta entendiendo que hace el codigo, para que sirve, donde se utiliza, que modifica ese bloque de codigo y demas 


Lectura 2 

1)  En Firestore no hay JOINs entre colecciones. ¿Qué significa esto en la práctica a la hora de diseñar cómo vas a guardar los datos, y qué es la "denormalización" como respuesta a esa restricción?

En firestore no existe el joins como en una base de datos relacional, significa que no podemos combinar informacion de distintas colecciones con una unica consulta. Por eso usamos la denormalizacion que consiste en duplicar algunos datos que sean necesarios para alguna consulta especifica.Prioriza velocidad de lectura y simplicidad de accesos por encima de evitar datos repetidos. Por eso en la practica tenemos que pensar la base de datos en como se van a leer esos datos. 

2) Explicá con el ejemplo de Order: ¿por qué conviene guardar dentro de items[] el name y el priceAtPurchase del producto en el momento de la compra, en vez de solo guardar el productId y consultar el catálogo cada vez?

Conviene hacer el snapshot para asegurarnos que a futuro siempre se lean los datos correctos de ese momento por si sufren alguna variación para que no cambie en el historial de order. 
si un cliente reclama una compra de hace meses, o hay que auditar ventas, necesitás poder demostrar exactamente qué compró y a qué precio, sin importar que el producto haya cambiado o se haya borrado del catálogo después

3) ¿Por qué la colección products (el catálogo) NO se denormaliza de la misma forma que orders? ¿Qué diferencia de naturaleza hay entre esos dos datos?

porque order es un hecho historico que no debe modificarse, en caambio products representa el estado actual del catalogo y sus datos si pueden ir cambiando continuamente, y siempre va a ver una unica versión actualizada

4) ¿Qué es un "contrato de datos" (interface TypeScript) y qué criterio se usa para decidir si un campo debe ser obligatorio u opcional? Dame un ejemplo con Product o Order.
contratos de datos = interface de typscript que definie la estructura de un objeto (propiedades y tipos de datos). asi toda la aplicación maneja los datos de forma consistente y segura 
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
}
id, name, price y stock son obligatorios porque el producto no tendría sentido sin ellos.
imageUrl es opcional porque puede haber productos que todavía no tengan una imagen cargada.


5) ¿Cuál es la responsabilidad de la capa services/ en este proyecto? ¿Por qué es un error que un componente o un context importe funciones de Firestore directamente?
La carpeta services/ se encarga de toda la comunicación con Firestore. Allí se concentran las operaciones para crear, leer, actualizar y eliminar documentos.

Su responsabilidad es aislar el acceso a la base de datos del resto de la aplicación.

Si un componente o un contexto importara directamente funciones de Firestore:

quedaría acoplado a Firestore;
sería más difícil cambiar la base de datos en el futuro;
habría lógica de acceso a datos repetida en distintos lugares;
sería más difícil mantener y probar el código.

En cambio, los componentes deberían consumir únicamente funciones del servicio, por ejemplo:

getProducts();
createOrder();
updateProduct();

Así la UI solo se preocupa por mostrar información y no por cómo se obtiene.

6) ¿Qué hace un FirestoreDataConverter (con sus dos funciones) y por qué la UI/contexts nunca deberían trabajar directamente con el tipo Timestamp de Firestore?

Un FirestoreDataConverter transforma los datos entre el formato que usa Firestore y el formato que utiliza nuestra aplicación.

Tiene dos funciones:

toFirestore(): convierte un objeto de la aplicación al formato que Firestore necesita antes de guardarlo.
fromFirestore(): convierte un documento obtenido de Firestore al modelo que utiliza la aplicación.

Por ejemplo, un Timestamp de Firestore puede convertirse automáticamente a un objeto Date.

Esto evita que la UI y los contexts dependan de tipos propios de Firestore.

La interfaz de usuario debería trabajar únicamente con tipos estándar de JavaScript o TypeScript, como Date, string o number, manteniendo desacoplada la lógica de la aplicación de la tecnología de almacenamiento.

7) En el "Momento AI-Driven" de esta lectura, ¿qué rol cumple la IA al revisar el modelo de datos, y qué checklist de criterios humanos se usa antes de aceptar una sugerencia suya?

En este proceso, la IA actúa como un asistente de revisión y análisis, ayudando a detectar posibles mejoras en el diseño del modelo de datos, identificar redundancias o sugerir alternativas de organización.

Sin embargo, sus propuestas no deben aceptarse automáticamente. Antes de aplicarlas, se revisan con criterios humanos como:

¿La propuesta respeta los requisitos del negocio?
¿Reduce o aumenta la complejidad del modelo?
¿Mejora el rendimiento de las consultas?
¿Mantiene la consistencia de los datos?
¿Respeta la estrategia de denormalización elegida?
¿Es fácil de mantener y comprender por el equipo?
¿Evita dependencias innecesarias y acoplamiento?

La decisión final siempre corresponde al desarrollador, que evalúa si la sugerencia realmente aporta valor al proyecto y se ajusta a sus necesidades.