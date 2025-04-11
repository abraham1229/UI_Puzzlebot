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

    def run_launch(self, launch_name):
        try:
            launch_command = f"bash -c 'cd /home/abraham1229/ros2_ws && source install/setup.bash && ros2 launch ui_implementation {launch_name}_launch.py'"
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

    # Manejar Ctrl+C para cerrar procesos antes de salir
    def signal_handler(sig, frame):
        print("Interrupción recibida (Ctrl+C), cerrando procesos...")
        if minimal_subscriber.launch_process is not None:
            try:
                os.killpg(os.getpgid(minimal_subscriber.launch_process.pid), signal.SIGTERM)
                print("Proceso hijo terminado.")
            except Exception as e:
                print(f"Error al cerrar el proceso hijo: {e}")
        rclpy.shutdown()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)

    try:
        rclpy.spin(minimal_subscriber)
    finally:
        # Asegurar limpieza final
        minimal_subscriber.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()