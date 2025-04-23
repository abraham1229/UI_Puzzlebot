import rclpy
from rclpy.node import Node
from std_msgs.msg import Int32
import subprocess
import os
import signal
import sys
import psutil


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
        self.launch_process_number = 0
        self.launch_process_number_anterior = 0
        self.launch_process = None
        self.ws_process = None

        self.run_web_socket()

        self.get_logger().info(f"UI listener initialized")




    def listener_callback(self, msg):
        
        self.launch_process_number = msg.data

        if self.launch_process_number == self.launch_process_number_anterior:
            return
        
        if self.launch_process is not None:
            self.terminate_launch_process()

        if msg.data == 1:
            self.run_launch("puzzlebot")
        elif msg.data == 2:
            self.run_launch("puzzledrone")
        else:
            self.get_logger().info(f"Comando desconocido: {msg.data}")
        
        self.launch_process_number_anterior = self.launch_process_number

    def run_web_socket(self):
        try:
            home_dir = os.path.expanduser("~")
            launch_command = f"bash -c 'source {home_dir}/ros2_ws/install/setup.bash && ros2 launch rosbridge_server rosbridge_websocket_launch.xml'"
            #launch_command = "bash -c 'source /home/ai31/ros2_ws/install/setup.bash && ros2 launch rosbridge_server rosbridge_websocket_launch.xml'"
            self.get_logger().info(f"Ejecutando WebSocket: {launch_command}")
            self.ws_process = subprocess.Popen(
                launch_command,
                shell=True,
                preexec_fn=os.setsid
            )
        except Exception as e:
            self.get_logger().error(f"Error al ejecutar el WebSocket: {str(e)}")

    def terminate_web_socket(self):
        try:
            if self.ws_process is not None:
                os.killpg(os.getpgid(self.ws_process.pid), signal.SIGTERM)
                self.get_logger().info("WebSocket: proceso principal terminado.")
                self.ws_process = None

            for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
                try:
                    cmdline = " ".join(proc.info['cmdline']) if proc.info['cmdline'] else ""
                    if "rosbridge_websocket" in cmdline:
                        self.get_logger().info(f"Matando WebSocket huérfano: {proc.info['name']} (pid={proc.info['pid']})")
                        proc.kill()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue

        except Exception as e:
            self.get_logger().error(f"Error al cerrar el WebSocket: {str(e)}")



    def run_launch(self, launch_name):
        try:
            home_dir = os.path.expanduser("~")
            launch_command = f"bash -c 'cd {home_dir}/ros2_ws && source install/setup.bash && ros2 launch ui_implementation {launch_name}_launch.py'"
            #launch_command = f"bash -c 'cd /home/ai31/ros2_ws && source install/setup.bash && ros2 launch ui_implementation {launch_name}_launch.py'"
            self.get_logger().info(f"Ejecutando: {launch_command}")
            self.launch_process = subprocess.Popen(
                launch_command,
                shell=True,
                preexec_fn=os.setsid
            )
        except Exception as e:
            self.get_logger().error(f"Error al ejecutar el launch: {str(e)}")

    def terminate_launch_process(self):
        try:
            os.killpg(os.getpgid(self.launch_process.pid), signal.SIGTERM)  # Mata el grupo de procesos
            self.get_logger().info("Proceso anterior terminado.")
            self.launch_process = None
            
            for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
                try:
                    cmdline = " ".join(proc.info['cmdline']) if proc.info['cmdline'] else ""
                    if any(word in cmdline for word in ['puzzlebot', 'puzzledrone', 'robot_state_publisher', 'tf_broadcaster', 'rviz2']):
                        self.get_logger().info(f"Matando proceso relacionado: {proc.info['name']} (pid={proc.info['pid']})")
                        proc.kill()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue

        except Exception as e:
            self.get_logger().error(f"Error al cerrar el proceso: {str(e)}")


def main(args=None):
    rclpy.init(args=args)
    minimal_subscriber = MinimalSubscriber()

    try:
        rclpy.spin(minimal_subscriber)
    finally:
        # Aquí se ejecuta al hacer Ctrl+C o shutdown por ROS
        if minimal_subscriber.launch_process is not None:
            os.killpg(os.getpgid(minimal_subscriber.launch_process.pid), signal.SIGTERM)
        if minimal_subscriber.ws_process is not None:
            minimal_subscriber.terminate_web_socket()

        minimal_subscriber.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()