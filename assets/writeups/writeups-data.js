window.WRITEUPS = [
  {
    id: "snoopy",
    title: "Snoopy: LFI, credential exposure & Linux capabilities privesc",
    url: "writeup.html?id=snoopy",
    legacyUrl: "writeups/snoopy-lfi-capabilities.html",
    category: "Web Security",
    difficulty: "Medium",
    readTime: "8 min",
    date: "2026",
    visibility: "Public redacted",
    summary: "Cadena Linux desde LFI hasta root mediante exposición de credenciales y abuso de capabilities sobre Python.",
    tags: ["LFI", "Linux", "Capabilities", "Python", "SSH", "Privilege Escalation"],
    stack: ["Apache", "Linux", "Python", "getcap"],
    cover: "assets/imgs/cover-linux.svg",
    icon: "🕸️",
    featured: true,
    highlight: "Enumeración web, acceso inicial y escalada local en un mismo flujo técnico.",
    labName: "Snoopy",
    target: "Ubuntu web server",
    impact: "Full compromise",
    killChain: ["Reconnaissance", "LFI", "Credential exposure", "SSH access", "Linux capabilities privesc"],
    sections: {
      executiveSummary: "El laboratorio documenta una cadena de intrusión completa sobre un servidor Linux: reconocimiento de servicios, validación de Local File Inclusion, exposición de credenciales reutilizables, acceso SSH y escalada final mediante una capability insegura asignada a Python. La versión pública mantiene la trazabilidad técnica sin exponer flags, credenciales ni secretos.",
      scopeContext: "El alcance corresponde a un entorno de laboratorio controlado. El objetivo fue analizar la superficie expuesta, identificar vectores de acceso inicial y validar una ruta de privilege escalation local. Cualquier dato sensible queda saneado para publicación.",
      reconnaissanceEnumeration: [
        "Escaneo inicial de puertos y fingerprinting de servicios con Nmap.",
        "Enumeración web para localizar rutas, parámetros y posibles ficheros auxiliares.",
        "Validación de rutas internas y pruebas controladas de path traversal/LFI.",
        "Revisión de usuarios locales expuestos mediante lectura de ficheros del sistema."
      ],
      attackSurfaceAnalysis: "La superficie de ataque combina exposición HTTP con validación insuficiente de rutas. El fallo permite leer archivos locales y facilita el descubrimiento de información operativa. La cadena se agrava por credenciales expuestas y una configuración local peligrosa en Linux capabilities.",
      initialAccess: "El acceso inicial se obtiene tras correlacionar la lectura de ficheros locales con material sensible expuesto. Las credenciales recuperadas no se publican y se representan como password: ********. Con ellas se valida una sesión SSH como usuario no privilegiado.",
      privilegeEscalation: "La enumeración local identifica capabilities peligrosas. El intérprete Python dispone de cap_setuid, lo que permite cambiar el UID efectivo a 0 y abrir una shell privilegiada. La flag de root queda sustituida por HTB{REDACTED}.",
      recommendations: [
        "Implementar whitelist estricta de plantillas y bloquear rutas controladas por el usuario.",
        "Eliminar backups, configuraciones y secretos de directorios servidos por HTTP.",
        "Rotar credenciales expuestas y evitar reutilización entre servicios.",
        "Auditar Linux capabilities y retirar cap_setuid de intérpretes como Python, Perl o Ruby.",
        "Registrar accesos anómalos a ficheros sensibles como /etc/passwd, /etc/shadow o configuraciones internas."
      ],
      conclusion: "El caso demuestra cómo pequeños fallos acumulados pueden terminar en compromiso total. La lección principal es que la validación de entrada, la gestión de secretos y el hardening local deben tratarse como controles conectados, no como medidas aisladas."
    },
    commands: [
      "nmap -sC -sV -p- <target>",
      "curl \"http://<target>/index.php?page=../../../../../../etc/passwd\"",
      "curl \"http://<target>/index.php?page=../../../../../../etc/os-release\"",
      "ssh <user>@<target> # password: ********",
      "getcap -r / 2>/dev/null",
      "python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'"
    ],
    evidence: [
      {
        title: "Escaneo de puertos — Nmap",
        phase: "Reconnaissance & Enumeration",
        description: "Identificación de servicios expuestos: HTTP en puerto 8081 y SSH en 22. El resultado permite centrar el análisis en la aplicación web.",
        image: "assets/writeups/img/snoopy-lfi-capabilities-06-nmap.jpg",
        caption: "Salida de Nmap mostrando los puertos abiertos del objetivo.",
        command: "nmap -sC -sV -p- <target>",
        redacted: false
      },
      {
        title: "Aplicación web en puerto 8081",
        phase: "Reconnaissance & Enumeration",
        description: "Acceso a la interfaz web del servicio expuesto. La aplicación admite un parámetro de navegación vulnerable a path traversal.",
        image: "assets/writeups/img/snoopy-lfi-capabilities-10-snoopy-puerto-8081.jpg",
        caption: "Interfaz web de Snoopy en el puerto 8081.",
        redacted: false
      },
      {
        title: "Payload LFI — lectura de /etc/os-release",
        phase: "Initial Access",
        description: "Confirmación de Local File Inclusion: el parámetro page permite acceder a ficheros locales del servidor. Se leen ficheros del sistema sin exponer credenciales.",
        image: "assets/writeups/img/snoopy-lfi-capabilities-09-payload-osrelease.jpg",
        caption: "LFI confirmado: lectura de /etc/os-release a través del parámetro vulnerable.",
        command: "curl \"http://<target>/index.php?page=../../../../../../etc/os-release\"",
        redacted: false
      },
      {
        title: "Payload LFI — lectura de fichero sensible",
        phase: "Initial Access",
        description: "Mediante LFI se localiza y lee un fichero con credenciales. Las credenciales reales no se publican y se representan como password: ********.",
        image: "assets/writeups/img/snoopy-lfi-capabilities-08-payload.jpg",
        caption: "Payload de LFI apuntando a fichero con material sensible. Credenciales saneadas.",
        redacted: true
      },
      {
        title: "Acceso SSH como usuario no privilegiado",
        phase: "Initial Access",
        description: "Con las credenciales recuperadas se valida acceso interactivo al sistema vía SSH. Se obtiene flag de usuario.",
        image: "assets/writeups/img/snoopy-lfi-capabilities-01-acceso-ssh.jpg",
        caption: "Sesión SSH activa como usuario no privilegiado.",
        command: "ssh <user>@<target> # password: ********",
        redacted: true
      },
      {
        title: "Flag de usuario (saneada)",
        phase: "Initial Access",
        description: "Confirmación de flag de usuario. El valor real está sustituido por HTB{REDACTED}.",
        image: "assets/writeups/img/snoopy-lfi-capabilities-05-flag-user-txt.jpg",
        caption: "Flag de usuario obtenida. Valor saneado antes de publicación.",
        redacted: true
      },
      {
        title: "Detección de Linux capabilities peligrosas",
        phase: "Privilege Escalation",
        description: "La enumeración local con getcap revela que el intérprete Python tiene cap_setuid asignada, lo que permite cambiar el UID efectivo a 0.",
        image: "assets/writeups/img/snoopy-lfi-capabilities-04-deteccion-capabilitites-en-binarios.jpg",
        caption: "getcap muestra Python con cap_setuid — vector de escalada confirmado.",
        command: "getcap -r / 2>/dev/null",
        redacted: false
      },
      {
        title: "Escalada a root mediante cap_setuid",
        phase: "Privilege Escalation",
        description: "Se abusa de la capability para cambiar el UID efectivo a 0 y obtener shell privilegiada. La flag de root queda sustituida por HTB{REDACTED}.",
        image: "assets/writeups/img/snoopy-lfi-capabilities-07-obtencion-root.jpg",
        caption: "Shell root obtenida mediante cap_setuid en Python. Flag saneada.",
        command: "python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
        redacted: true
      }
    ]
  },
  {
    id: "cap",
    title: "CAP: insecure packet capture exposure, FTP credential reuse and cap_setuid privesc",
    url: "writeup.html?id=cap",
    legacyUrl: "writeups/cap-pcap-ftp-capabilities.html",
    category: "Web Security",
    difficulty: "Easy",
    readTime: "8 min",
    date: "2026",
    visibility: "Public redacted",
    summary: "Exposición de capturas históricas, recuperación de credenciales FTP y escalada Linux mediante cap_setuid.",
    tags: ["PCAP", "FTP", "Wireshark", "Linux", "Capabilities", "Credential Reuse"],
    stack: ["Gunicorn", "FTP", "Python", "Wireshark"],
    cover: "assets/imgs/cover-cap.svg",
    icon: "🧢",
    featured: true,
    highlight: "Análisis de tráfico, reutilización de credenciales y privilege escalation.",
    labName: "CAP",
    target: "Linux web application",
    impact: "User compromise + root escalation",
    killChain: ["Web enumeration", "PCAP disclosure", "Credential recovery", "SSH access", "cap_setuid privesc"],
    sections: {
      executiveSummary: "El laboratorio muestra el impacto de publicar capturas de red accesibles desde una aplicación web. El análisis del PCAP permite recuperar credenciales reutilizables, obtener acceso interactivo y elevar privilegios mediante cap_setuid en Python.",
      scopeContext: "Entorno de laboratorio centrado en exposición de evidencias de red y malas prácticas de reutilización de credenciales. La publicación omite contraseñas, flags y valores sensibles.",
      reconnaissanceEnumeration: [
        "Identificación de aplicación web y endpoints asociados a capturas de seguridad.",
        "Descarga y análisis de capturas históricas.",
        "Filtrado de protocolos de aplicación en Wireshark para localizar datos sensibles.",
        "Comprobación de reutilización de credenciales en servicios interactivos."
      ],
      attackSurfaceAnalysis: "La debilidad principal es la exposición de PCAPs con tráfico sensible. Cuando una captura contiene credenciales en protocolos sin cifrar, el riesgo se traslada de disclosure a acceso real. La mala configuración de capabilities completa la cadena hacia root.",
      initialAccess: "La captura contiene credenciales recuperables. Tras sanearlas como password: ********, se valida acceso con un usuario legítimo. No se publican valores reales.",
      privilegeEscalation: "La enumeración local detecta Python con cap_setuid. Esta capability permite obtener shell privilegiada con UID 0 en el contexto del laboratorio.",
      recommendations: [
        "No publicar PCAPs ni snapshots técnicos sin saneado previo.",
        "Evitar protocolos que transmitan credenciales en claro.",
        "Aplicar control de acceso estricto sobre endpoints de diagnósticos y capturas.",
        "Rotar cualquier credencial que haya atravesado tráfico capturado.",
        "Eliminar capabilities peligrosas de intérpretes y binarios no imprescindibles."
      ],
      conclusion: "El caso evidencia que los artefactos de diagnóstico también forman parte de la superficie de ataque. Una captura aparentemente operativa puede convertirse en credenciales, acceso y escalada."
    },
    commands: [
      "nmap -sC -sV -p- <target>",
      "curl -O http://<target>/data/0",
      "wireshark <capture>.pcap",
      "ssh <user>@<target> # password: ********",
      "getcap -r / 2>/dev/null",
      "python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'"
    ],
    evidence: [
      {
        title: "Reconocimiento inicial — Nmap",
        phase: "Reconnaissance & Enumeration",
        description: "Escaneo de servicios que revela aplicación web y otros puertos relevantes.",
        image: "assets/writeups/img/cap-recon-nmap.png",
        caption: "Nmap revela la superficie de ataque inicial del objetivo.",
        command: "nmap -sC -sV -p- <target>",
        redacted: false
      },
      {
        title: "Exposición de capturas de red (PCAP)",
        phase: "Reconnaissance & Enumeration",
        description: "La aplicación web expone capturas de tráfico históricas accesibles sin autenticación. Se descarga la captura para análisis offline.",
        image: "assets/writeups/img/cap-pcap-analysis.png",
        caption: "PCAP descargado desde el endpoint público de la aplicación.",
        command: "curl -O http://<target>/data/0",
        redacted: false
      },
      {
        title: "Análisis de tráfico FTP — credenciales en claro",
        phase: "Initial Access",
        description: "El análisis de la captura en Wireshark revela credenciales FTP transmitidas en texto claro. Se sanean antes de publicación.",
        image: "assets/writeups/img/cap-ftp-stream.png",
        caption: "Stream FTP en Wireshark con credenciales saneadas (usuario y contraseña reales ocultados).",
        redacted: true
      },
      {
        title: "Acceso SSH — reutilización de credenciales",
        phase: "Initial Access",
        description: "Las credenciales FTP son reutilizables en SSH. Se obtiene acceso interactivo al sistema como usuario no privilegiado.",
        image: "assets/writeups/img/cap-user-flag.png",
        caption: "Acceso SSH con credenciales recuperadas del PCAP. Flag de usuario saneada.",
        command: "ssh <user>@<target> # password: ********",
        redacted: true
      },
      {
        title: "Detección y abuso de cap_setuid",
        phase: "Privilege Escalation",
        description: "Enumeración local detecta Python con cap_setuid. Se abusa para obtener shell root. Flag saneada.",
        image: "assets/writeups/img/cap-root-privesc.png",
        caption: "cap_setuid en Python permite elevar a root. Flag de root saneada.",
        command: "getcap -r / 2>/dev/null\npython3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
        redacted: true
      }
    ]
  },
  {
    id: "wpa2-handshake",
    title: "WPA2-PSK audit: handshake capture, cracking and traffic decryption",
    url: "writeup.html?id=wpa2-handshake",
    legacyUrl: "writeups/wpa2-handshake-cracking.html",
    category: "Wireless",
    difficulty: "Medium",
    readTime: "9 min",
    date: "2026",
    visibility: "Public redacted",
    summary: "Auditoría WiFi completa con captura de handshake, cracking y análisis de tráfico descifrado.",
    tags: ["WPA2", "Handshake", "Wireless", "Wireshark", "Aircrack-ng", "Deauth"],
    stack: ["airodump-ng", "aireplay-ng", "aircrack-ng", "Wireshark"],
    cover: "assets/imgs/cover-wireless.svg",
    icon: "📡",
    featured: true,
    highlight: "Cobertura completa de auditoría inalámbrica ofensiva y análisis de paquetes.",
    labName: "WPA2-PSK audit",
    target: "Wireless lab network",
    impact: "PSK recovery in controlled conditions",
    killChain: ["Monitor mode", "Handshake capture", "Controlled deauth", "Offline cracking", "Traffic decryption"],
    sections: {
      executiveSummary: "El laboratorio documenta una auditoría WPA2-PSK en entorno controlado: preparación de interfaz, captura de handshake, deautenticación controlada, cracking offline y análisis de tráfico descifrado.",
      scopeContext: "Prueba realizada exclusivamente sobre una red de laboratorio autorizada. Se ocultan SSID sensibles, BSSID completos, claves y cualquier material reutilizable.",
      reconnaissanceEnumeration: [
        "Identificación de interfaces inalámbricas disponibles.",
        "Activación de modo monitor.",
        "Enumeración de redes, canales y clientes asociados.",
        "Captura de handshake WPA2-PSK."
      ],
      attackSurfaceAnalysis: "El vector depende de la robustez de la PSK y de la disponibilidad de clientes para forzar o esperar un nuevo handshake. El cracking es offline, por lo que la mitigación principal es una clave fuerte y políticas de rotación adecuadas.",
      initialAccess: "No aplica acceso interactivo a host. El resultado técnico es la recuperación controlada de la PSK en laboratorio y la posibilidad de descifrar tráfico capturado.",
      privilegeEscalation: "Not documented in the available evidence.",
      recommendations: [
        "Usar WPA2/WPA3 con contraseñas largas, aleatorias y no basadas en diccionario.",
        "Deshabilitar WPS si no es estrictamente necesario.",
        "Monitorizar deautenticaciones anómalas y cambios bruscos de asociación.",
        "Segmentar clientes inalámbricos y aplicar aislamiento cuando corresponda.",
        "Rotar PSK tras sospechas de exposición o auditorías fallidas."
      ],
      conclusion: "El caso muestra la diferencia entre capturar un handshake y comprometer realmente una red: la seguridad práctica depende sobre todo de la entropía de la PSK y de la monitorización del entorno inalámbrico."
    },
    commands: [
      "airmon-ng start wlan0",
      "airodump-ng wlan0mon",
      "airodump-ng -c <channel> --bssid <BSSID_REDACTED> -w capture wlan0mon",
      "aireplay-ng -0 5 -a <BSSID_REDACTED> wlan0mon",
      "aircrack-ng capture-01.cap -w <wordlist>",
      "wireshark capture-01.cap"
    ],
    evidence: [
      {
        title: "Activación del modo monitor",
        phase: "Reconnaissance & Enumeration",
        description: "La interfaz inalámbrica se configura en modo monitor para poder capturar tramas sin asociación.",
        image: "assets/writeups/img/wpa2-handshake-cracking-03-3-comando-airmon-conmonitor.jpg",
        caption: "airmon-ng activa el modo monitor sobre la interfaz inalámbrica.",
        command: "airmon-ng start wlan0",
        redacted: false
      },
      {
        title: "Escaneo de redes disponibles",
        phase: "Reconnaissance & Enumeration",
        description: "Enumeración de puntos de acceso en el entorno de laboratorio: SSID, BSSID, canal y clientes. Datos saneados.",
        image: "assets/writeups/img/wpa2-handshake-cracking-04-4-escaneo-de-redes.jpg",
        caption: "airodump-ng lista redes y clientes. SSID y BSSID saneados en la versión pública.",
        command: "airodump-ng wlan0mon",
        redacted: true
      },
      {
        title: "Captura dirigida al objetivo",
        phase: "Reconnaissance & Enumeration",
        description: "Se fija el canal y el BSSID de la red objetivo para capturar únicamente el tráfico relevante.",
        image: "assets/writeups/img/wpa2-handshake-cracking-05-5-captura-movil.jpg",
        caption: "Captura dirigida al BSSID objetivo. Datos de red saneados.",
        command: "airodump-ng -c <channel> --bssid <BSSID_REDACTED> -w capture wlan0mon",
        redacted: true
      },
      {
        title: "Deautenticación controlada y captura de handshake",
        phase: "Initial Access",
        description: "Se envían frames de deautenticación para forzar la reasociación del cliente y capturar el handshake WPA2.",
        image: "assets/writeups/img/wpa2-handshake-cracking-07-7-handshake.jpg",
        caption: "Handshake WPA2-PSK capturado. BSSID y clave saneados.",
        command: "aireplay-ng -0 5 -a <BSSID_REDACTED> wlan0mon",
        redacted: true
      },
      {
        title: "Cracking offline con aircrack-ng",
        phase: "Technical Evidence",
        description: "El handshake se analiza offline con diccionario. La PSK se recupera en laboratorio. El valor real no se publica.",
        image: "assets/writeups/img/wpa2-handshake-cracking-12-12-resultado-crackeo-contrasena.jpg",
        caption: "Resultado de aircrack-ng: PSK recuperada. Valor saneado.",
        command: "aircrack-ng capture-01.cap -w <wordlist>",
        redacted: true
      },
      {
        title: "Descifrado de tráfico en Wireshark",
        phase: "Technical Evidence",
        description: "Con la PSK recuperada se descifra el tráfico capturado en Wireshark, demostrando el impacto real de la auditoría.",
        image: "assets/writeups/img/wpa2-handshake-cracking-14-14-wireshark.jpg",
        caption: "Wireshark con tráfico descifrado usando la PSK obtenida.",
        command: "wireshark capture-01.cap",
        redacted: false
      }
    ]
  }
];