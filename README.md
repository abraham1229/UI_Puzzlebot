# URDF Visualizer UI for ROS 2

Este proyecto permite seleccionar y visualizar modelos URDF en ROS 2 mediante una interfaz gráfica hecha en React. Utiliza ROSLIB para publicar a un tópico y mostrar el modelo seleccionado en RViz2.

## 📁 Estructura del proyecto

- **frontend/** → Aplicación React + Vite
- **ui_implementation/** → Paquete de ROS 2 que escucha el tópico publicado por el frontend

---

## 📦 Paquetes necesitados

Para instalar corre el siguiente código en terminal:
### RosBridge
```
# ROS packages
sudo apt install ros-humble-rosbridge-suite
```
### psutil
```
# Python package
pip install psutil
```

## 🚀 Frontend (React + ROSLIB)

### 📦 Instalación

1. Dirígete a la carpeta `frontend`
2. Ejecuta los siguientes comandos:
```
npm install
```
```
npm run dev
```

Esto levantará la UI en modo desarrollo. La interfaz te permitirá seleccionar el modelo a visualizar, y enviará el valor a un tópico `std_msgs/Int32` usando ROSLIB.

---

## 🧠 Backend (ROS 2 - ui_implementation)

### 🔧 Instrucciones

1. Coloca el paquete `ui_implementation` en el workspace de ROS 2 (`ros2_ws/src`)
2. Ejecuta los siguientes comandos en tu directorio de ros (ros2_ws comúnmente):

```
colcon build --packages-select ui_implementation
```
```
source install/setup.bash
```  
```
ros2 run ui_implementation ui_listener
```

El nodo `ui_listener` escuchará el tópico y activará el modelo URDF correspondiente en RViz2.

---

## ✅ Requisitos

- ROS 2 (Humble u otra versión compatible)
- Rviz2 instalado
- Node.js 16+

---

## 👨‍💻 Autores

- **Abraham Ortiz** - [GitHub](https://github.com/abrahamortiz) 
- **Alan Flores** - [GitHub](https://github.com/AIF31)

---

