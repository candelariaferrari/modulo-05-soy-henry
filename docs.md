types/: contratos del dominio  
Si una parte del sistema necesita crear o consumir datos —como un producto, un usuario o un ítem del carrito— aquí encuentra estructuras consistentes. Esto permite que los datos mantengan el mismo formato en toda la aplicación.

services/: acceso a datos  
Contiene las funciones que interactúan con APIs, almacenamiento o mocks. Si cambia la fuente de datos, el ajuste se realiza en esta capa sin afectar al resto del sistema.

contexts/: estado global  y la lógica de orquestación.  
Define qué datos están disponibles en la aplicación y cómo se actualizan, evitando pasar información manualmente entre múltiples componentes.

components/: UI reutilizable  
Son piezas independientes (como botones o cards) que reciben datos por props y no contienen lógica de negocio compleja.

pages/: pantallas por ruta
pantallas completas de la aplicación. Organiza componentes, consume estado global y estructura la navegación entre vistas.