import rclpy
from rclpy.node import Node
from std_msgs.msg import Int32
import subprocess
import os
import signal



class MinimalSubscriber(Node):

    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            Int32,
            'int_topic',
            self.listener_callback,
            10)
        self.subscription
        
        # Variable para almacenar el launch a correr
        self.launch_process = None 

    def listener_callback(self, msg):
        # Si ya hay un launch corriendo, no hacemos nada
        if self.launch_process is not None:
            self.get_logger().info("Ya hay un launch corriendo, no se ejecuta otro.")
            return

        # Comandos de lanzamiento basados en el valor de msg.data
        if msg.data == 1:
            self.run_launch("puzzlebot")
        elif msg.data == 2:
            self.run_launch("puzzledrone")
        else:
            self.get_logger().info(f"Comando desconocido: {msg.data}")

    def run_launch(self, launch_name):
        try:
            # Comando para abrir una nueva terminal y ejecutar los pasos
            terminal_command = f"gnome-terminal -- bash -c 'cd /home/abraham1229/ros2_ws && source install/setup.bash && ros2 launch ui_implementation {launch_name}_launch.py; exec bash'"

            # Ejecutar el comando
            self.get_logger().info(f"Ejecutando: {terminal_command}")
            self.launch_process = subprocess.Popen(terminal_command, shell=True)
        
        except Exception as e:
            self.get_logger().error(f"Error al ejecutar el launch: {str(e)}")


def main(args=None):
    rclpy.init(args=args)

    minimal_subscriber = MinimalSubscriber()

    rclpy.spin(minimal_subscriber)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    minimal_subscriber.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()