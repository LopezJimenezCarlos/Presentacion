/* writeups-labs.js — Laboratorios adicionales del Máster (M4) */
(function () {
  if (!Array.isArray(window.WRITEUPS)) window.WRITEUPS = [];

  var labs = [
    {
      id: "windows-metasploit-psexec",
      title: "Windows: FTP anónimo, SMB y acceso administrativo con Metasploit",
      url: "writeup.html?id=windows-metasploit-psexec",
      category: "Seguridad Web",
      difficulty: "Media",
      readTime: "10 min",
      date: "2026",
      visibility: "Versión pública saneada",
      summary: "Compromiso de entorno Windows mediante acceso FTP anónimo, lectura de credenciales en ficheros expuestos y acceso administrativo SMB a través de Metasploit.",
      tags: ["FTP", "SMB", "Metasploit", "Windows", "Credential Exposure", "Anonymous Access"],
      stack: ["Nmap", "Metasploit", "FTP", "SMB", "Windows"],
      cover: "assets/imgs/cover-smb-ftp.svg",
      featured: true,
      labName: "Windows Lab",
      target: "Windows Server",
      impact: "Acceso administrativo completo",
      killChain: ["Nmap", "FTP anónimo", "Lectura de credenciales", "Acceso SMB", "Admin shell"],
      sections: {
        executiveSummary: "El laboratorio documenta la explotación de un entorno Windows mediante servicios mal configurados: FTP con acceso anónimo, ficheros de texto con credenciales en claro y SMB sin control de acceso adecuado. La cadena culmina en acceso administrativo completo.",
        scopeContext: "Entorno de laboratorio controlado del módulo M4. El objetivo era identificar malas configuraciones en servicios de red Windows y demostrar cómo se encadenan para obtener acceso de administrador.",
        reconnaissanceEnumeration: [
          "Escaneo Nmap para identificar puertos y servicios (FTP, SMB, HTTP).",
          "Búsqueda de módulos FTP en Metasploit.",
          "Acceso anónimo al servidor FTP.",
          "Exploración de ficheros accesibles: policy.txt, README.txt y plantillas."
        ],
        attackSurfaceAnalysis: "La superficie de ataque combina FTP anónimo con credenciales expuestas en ficheros de texto. La reutilización de credenciales en SMB y la falta de restricciones de acceso administrativo permiten escalar desde lectura de ficheros hasta control completo del sistema.",
        initialAccess: "El acceso FTP anónimo permite leer ficheros con credenciales en claro. Las credenciales se sanean en la versión pública (password: ********). Con ellas se accede al recurso SMB como administrador.",
        privilegeEscalation: "El acceso SMB con credenciales de administrador otorga control total del sistema sin necesidad de escalada adicional. Se documenta acceso final con privilegios de administrador.",
        recommendations: [
          "Deshabilitar el acceso anónimo en FTP.",
          "Nunca almacenar credenciales en ficheros de texto accesibles por red.",
          "Aplicar control de acceso estricto en recursos SMB.",
          "Segmentar servicios de administración remota y aplicar MFA.",
          "Auditar regularmente los permisos de los recursos compartidos."
        ],
        conclusion: "El caso demuestra que la combinación de malas configuraciones aparentemente menores puede derivar en compromiso total. La seguridad en entornos Windows requiere hardening coordinado de todos los servicios expuestos."
      },
      commands: [
        "nmap -sC -sV -p- <target>",
        "ftp <target>  # usuario: anonymous",
        "get README.txt",
        "get password_policy.txt",
        "msfconsole",
        "use auxiliary/scanner/smb/smb_login",
        "set RHOSTS <target>",
        "set SMBUser administrator",
        "set SMBPass ********",
        "run"
      ],
      evidence: [
        {
          title: "Reconocimiento inicial — Nmap",
          phase: "Reconocimiento y enumeración",
          description: "Escaneo de puertos que revela FTP, SMB y HTTP activos en el objetivo Windows.",
          image: "assets/writeups/img/windows-metasploit-psexec-01-1-resultado-nmap.jpg",
          caption: "Resultado de Nmap mostrando los servicios expuestos del objetivo Windows.",
          command: "nmap -sC -sV -p- <target>",
          redacted: false
        },
        {
          title: "Metasploit — búsqueda de módulo FTP",
          phase: "Reconocimiento y enumeración",
          description: "Uso de Metasploit para identificar módulos de enumeración y explotación de FTP.",
          image: "assets/writeups/img/windows-metasploit-psexec-02-2-metasploit.jpg",
          caption: "Consola de Metasploit con búsqueda de módulos FTP.",
          redacted: false
        },
        {
          title: "Búsqueda de módulo FTP en Metasploit",
          phase: "Reconocimiento y enumeración",
          description: "Identificación del módulo correcto para el servicio FTP detectado.",
          image: "assets/writeups/img/windows-metasploit-psexec-03-3-busqueda-ftp.jpg",
          caption: "Módulo FTP identificado y listo para su configuración.",
          redacted: false
        },
        {
          title: "Acceso FTP anónimo",
          phase: "Acceso inicial",
          description: "El servidor FTP acepta conexiones anónimas, permitiendo navegar por los ficheros disponibles sin autenticación.",
          image: "assets/writeups/img/windows-metasploit-psexec-04-4-acceso-anonimo-ftp.jpg",
          caption: "Sesión FTP anónima establecida. Sin credenciales requeridas.",
          command: "ftp <target>  # usuario: anonymous",
          redacted: false
        },
        {
          title: "Exploración de ficheros disponibles",
          phase: "Acceso inicial",
          description: "Navegación por el directorio FTP para identificar ficheros con información relevante.",
          image: "assets/writeups/img/windows-metasploit-psexec-05-5-dentro-ftp.jpg",
          caption: "Contenido del directorio FTP accesible de forma anónima.",
          redacted: false
        },
        {
          title: "Política de contraseñas expuesta",
          phase: "Acceso inicial",
          description: "Se localiza un fichero con la política de contraseñas. Proporciona pistas sobre el formato de las credenciales del sistema.",
          image: "assets/writeups/img/windows-metasploit-psexec-06-6-pasword-policy.jpg",
          caption: "Fichero password_policy.txt accesible vía FTP anónimo.",
          redacted: false
        },
        {
          title: "Lectura de README.txt",
          phase: "Acceso inicial",
          description: "El fichero README contiene información operativa relevante para el acceso a otros servicios.",
          image: "assets/writeups/img/windows-metasploit-psexec-07-7-readme-txt.jpg",
          caption: "Contenido del README.txt con información de acceso. Credenciales saneadas.",
          redacted: true
        },
        {
          title: "Plantilla de acceso con credenciales",
          phase: "Acceso inicial",
          description: "Se descubre un fichero de plantilla con credenciales de acceso en texto claro. Las credenciales no se publican.",
          image: "assets/writeups/img/windows-metasploit-psexec-08-8-plantilla-acesso.jpg",
          caption: "Plantilla con credenciales de acceso. Datos saneados antes de publicación.",
          redacted: true
        },
        {
          title: "Acceso SMB con Metasploit",
          phase: "Acceso inicial",
          description: "Usando las credenciales recuperadas se accede al recurso compartido SMB a través del módulo de Metasploit.",
          image: "assets/writeups/img/windows-metasploit-psexec-09-9-msf-acesso-smb.jpg",
          caption: "Módulo SMB de Metasploit configurado con credenciales obtenidas.",
          redacted: true
        },
        {
          title: "Sesión SMB establecida",
          phase: "Acceso inicial",
          description: "Sesión SMB activa con las credenciales recuperadas del FTP.",
          image: "assets/writeups/img/windows-metasploit-psexec-10-10-sesion-smb.jpg",
          caption: "Sesión SMB activa. Credenciales saneadas.",
          redacted: true
        },
        {
          title: "Acceso a interfaz web",
          phase: "Acceso inicial",
          description: "Acceso a la interfaz web del sistema usando las credenciales obtenidas.",
          image: "assets/writeups/img/windows-metasploit-psexec-11-11-acceso-a-web.jpg",
          caption: "Panel web accesible con las credenciales recuperadas del FTP.",
          redacted: true
        },
        {
          title: "Acceso administrativo SMB",
          phase: "Privilege Escalation",
          description: "Las credenciales de administrador permiten acceso completo al sistema mediante SMB.",
          image: "assets/writeups/img/windows-metasploit-psexec-13-13-acceso-con-usuario-admin-smb.jpg",
          caption: "Acceso SMB con usuario administrador confirmado.",
          redacted: true
        },
        {
          title: "Acceso final con privilegios de administrador",
          phase: "Privilege Escalation",
          description: "Control completo del sistema Windows obtenido. Flag saneada.",
          image: "assets/writeups/img/windows-metasploit-psexec-14-accereso-final-con-admin.jpg",
          caption: "Acceso de administrador completo. Flag saneada antes de publicación.",
          redacted: true
        }
      ]
    },

    {
      id: "titanic-lfi-log-poisoning",
      title: "Titanic: LFI y Log Poisoning hacia RCE",
      url: "writeup.html?id=titanic-lfi-log-poisoning",
      category: "Seguridad Web",
      difficulty: "Media",
      readTime: "9 min",
      date: "2026",
      visibility: "Versión pública saneada",
      summary: "Explotación de LFI para acceder a logs de Apache, envenenamiento de log con payload PHP y ejecución remota de código para obtener acceso al sistema.",
      tags: ["LFI", "Log Poisoning", "RCE", "PHP", "Apache", "Linux"],
      stack: ["Nmap", "Apache", "PHP", "Burp Suite", "curl"],
      cover: "assets/imgs/cover-log-poisoning.svg",
      featured: true,
      labName: "Titanic",
      target: "Ubuntu web server (Apache)",
      impact: "RCE y acceso root",
      killChain: ["Nmap", "LFI", "Lectura de logs Apache", "Log Poisoning", "RCE", "Root"],
      sections: {
        executiveSummary: "El laboratorio documenta una cadena de ataque avanzada sobre un servidor Apache: se valida LFI para leer logs, se inyecta código PHP malicioso en el User-Agent para envenenar el log de Apache y se ejecuta código remoto. La cadena culmina en acceso root mediante escalada con awk.",
        scopeContext: "Entorno de laboratorio del módulo M4. El objetivo era demostrar cómo LFI combinado con log poisoning permite escalar desde exposición de ficheros hasta ejecución remota de código.",
        reconnaissanceEnumeration: [
          "Escaneo Nmap para identificar servicios HTTP.",
          "Acceso a la aplicación web y exploración de parámetros vulnerables.",
          "Validación de LFI mediante path traversal.",
          "Identificación de rutas de logs de Apache accesibles mediante LFI."
        ],
        attackSurfaceAnalysis: "La vulnerabilidad principal es un parámetro web que permite LFI sin sanitización. Combinado con la escritura de logs de Apache (que incluyen el User-Agent), el vector permite inyectar y ejecutar PHP desde el propio servidor.",
        initialAccess: "La lectura de /var/log/apache2/access.log confirma que el User-Agent se escribe en el log sin escape. Se inyecta un payload PHP que actúa como webshell al ser incluido mediante LFI.",
        privilegeEscalation: "Con ejecución de código como www-data se enumera el sistema. Se identifica que awk puede ejecutarse con permisos elevados, lo que permite obtener shell root.",
        recommendations: [
          "Validar y sanitizar todos los parámetros que puedan usarse como rutas de fichero.",
          "Restringir el acceso de la aplicación web a los directorios mínimos necesarios.",
          "Configurar logs de Apache para no ser legibles por el proceso web.",
          "Eliminar la capacidad de ejecutar binarios como awk con permisos elevados desde el proceso web.",
          "Aplicar encabezados de seguridad y filtrado de User-Agent malicioso."
        ],
        conclusion: "El caso ilustra cómo LFI combinado con log poisoning convierte un fallo de exposición de ficheros en ejecución remota de código. La cadena es técnicamente elegante y subraya la importancia del hardening en configuraciones Apache."
      },
      commands: [
        "nmap -sC -sV -p- <target>",
        "curl http://<target>/index.php?page=../../../../../../etc/passwd",
        "curl http://<target>/index.php?page=../../../../../../var/log/apache2/access.log",
        "curl -H 'User-Agent: <?php system($_GET[\"cmd\"]); ?>' http://<target>/",
        "curl 'http://<target>/index.php?page=../../../../../../var/log/apache2/access.log&cmd=id'",
        "awk 'BEGIN {system(\"/bin/bash\")}'  # privesc"
      ],
      evidence: [
        {
          title: "Reconocimiento inicial — Nmap",
          phase: "Reconocimiento y enumeración",
          description: "Escaneo que identifica el servidor web Apache expuesto.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-01-1-nmap.jpg",
          caption: "Nmap revela Apache activo en el objetivo.",
          command: "nmap -sC -sV -p- <target>",
          redacted: false
        },
        {
          title: "Acceso a la aplicación web",
          phase: "Reconocimiento y enumeración",
          description: "Exploración de la interfaz web y localización del parámetro vulnerable a LFI.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-02-2-acceso-pagina.jpg",
          caption: "Aplicación web con parámetro de navegación susceptible a path traversal.",
          redacted: false
        },
        {
          title: "Confirmación de LFI",
          phase: "Reconocimiento y enumeración",
          description: "Validación de Local File Inclusion: el parámetro permite leer ficheros del sistema.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-03-3-explotacionlfi.jpg",
          caption: "LFI confirmado — lectura de ficheros locales a través del parámetro web.",
          command: "curl http://<target>/index.php?page=../../../../../../etc/passwd",
          redacted: false
        },
        {
          title: "Pista de los logs de Apache",
          phase: "Acceso inicial",
          description: "Se identifica que el log de acceso de Apache es accesible mediante LFI, lo que habilita el vector de log poisoning.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-04-4-observamos-la-pista-de-los-logs-en-apache.jpg",
          caption: "Identificación de la ruta del log de Apache como vector de ataque.",
          redacted: false
        },
        {
          title: "Acceso al log de Apache mediante LFI",
          phase: "Acceso inicial",
          description: "Lectura del fichero access.log de Apache confirmando que los User-Agent se registran sin escape.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-05-5-acceso-logs.jpg",
          caption: "Contenido del log de Apache accesible vía LFI.",
          command: "curl http://<target>/index.php?page=../../../../../../var/log/apache2/access.log",
          redacted: false
        },
        {
          title: "Log Poisoning — inyección de payload PHP",
          phase: "Acceso inicial",
          description: "Se envía una petición con un payload PHP en el campo User-Agent para que quede registrado en el log.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-06-6-log-poisoning.jpg",
          caption: "Inyección de código PHP en el User-Agent que se escribe en el log de Apache.",
          command: "curl -H 'User-Agent: <?php system($_GET[\"cmd\"]); ?>' http://<target>/",
          redacted: false
        },
        {
          title: "Resultado del log poisoning",
          phase: "Acceso inicial",
          description: "El payload PHP queda registrado en el log. Al incluirlo mediante LFI se convierte en código ejecutable.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-07-7-resultado-log-poisoning.jpg",
          caption: "Payload PHP visible en el log de Apache — listo para ser ejecutado via LFI.",
          redacted: false
        },
        {
          title: "RCE — ejecución remota de código",
          phase: "Acceso inicial",
          description: "Al combinar LFI con el parámetro cmd, el payload PHP ejecuta comandos en el servidor.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-08-8-explotacion-log-poisoning.jpg",
          caption: "Ejecución remota de código mediante LFI + Log Poisoning.",
          command: "curl 'http://<target>/index.php?page=../../../../../../var/log/apache2/access.log&cmd=id'",
          redacted: false
        },
        {
          title: "Exploración post-explotación",
          phase: "Privilege Escalation",
          description: "Con RCE activo se enumera el sistema para identificar vectores de escalada. Se identifica awk como candidato.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-09-9-explica-que-tras-varios-errores-como-intentar-ssh-por-ahi-.jpg",
          caption: "Exploración del sistema tras obtener RCE como www-data.",
          redacted: false
        },
        {
          title: "Flag de usuario (saneada)",
          phase: "Privilege Escalation",
          description: "Obtención de la flag de usuario en el directorio habitual. Valor saneado.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-10-10-obtencion-user-txt-en-directorio-usual.jpg",
          caption: "Flag de usuario obtenida. HTB{REDACTED}.",
          redacted: true
        },
        {
          title: "Escalada a root mediante awk",
          phase: "Privilege Escalation",
          description: "awk se puede ejecutar con privilegios elevados desde el contexto web. Se usa para obtener shell root. Flag saneada.",
          image: "assets/writeups/img/titanic-lfi-log-poisoning-11-11-obtencion-de-root-mediante-awk.jpg",
          caption: "Escalada a root usando awk. Flag de root saneada.",
          command: "awk 'BEGIN {system(\"/bin/bash\")}'",
          redacted: true
        }
      ]
    },

    {
      id: "sqlmap-sqli",
      title: "SQL Injection: bypass, sqlmap y escalada de privilegios",
      url: "writeup.html?id=sqlmap-sqli",
      category: "Seguridad Web",
      difficulty: "Media",
      readTime: "9 min",
      date: "2026",
      visibility: "Versión pública saneada",
      summary: "Bypass de autenticación mediante SQLi manual, enumeración de base de datos con sqlmap usando cookie de sesión y escalada local en Linux.",
      tags: ["SQLi", "sqlmap", "Bypass", "SSH", "Linux", "Privilege Escalation"],
      stack: ["Nmap", "Burp Suite", "sqlmap", "Linux"],
      cover: "assets/imgs/cover-sqlmap.svg",
      featured: true,
      labName: "SQL Injection Lab",
      target: "Aplicación web vulnerable con backend Linux",
      impact: "Bypass de login, extracción de base de datos y acceso root",
      killChain: ["Nmap", "Bypass SQLi", "Cookie de sesión", "sqlmap", "Credenciales SSH", "Privesc"],
      sections: {
        executiveSummary: "El laboratorio documenta una cadena completa de SQL Injection: desde el bypass manual de autenticación con payloads clásicos hasta la automatización con sqlmap usando la cookie de sesión obtenida, extracción de tablas, usuarios y contraseñas, acceso SSH y escalada de privilegios a root.",
        scopeContext: "Laboratorio controlado del módulo M4. El objetivo era demostrar el impacto real de una inyección SQL sin controles de entrada, desde el bypass de login hasta el compromiso total del sistema.",
        reconnaissanceEnumeration: [
          "Escaneo Nmap para identificar el servicio web.",
          "Acceso a la aplicación y análisis del formulario de autenticación.",
          "Pruebas manuales de payloads SQLi clásicos.",
          "Obtención de cookie de sesión tras bypass exitoso."
        ],
        attackSurfaceAnalysis: "El formulario de autenticación no sanitiza las entradas. Los payloads clásicos como ' OR 1=1 -- permiten eludir la autenticación. La cookie de sesión resultante se usa para que sqlmap pueda interactuar con la aplicación como usuario autenticado.",
        initialAccess: "El bypass manual con ' OR '1'='1 proporciona acceso sin credenciales válidas. La cookie se extrae y se pasa a sqlmap para la enumeración automatizada. Las credenciales reales de usuarios no se publican.",
        privilegeEscalation: "sqlmap extrae usuarios y hashes de la base de datos. Las credenciales recuperadas permiten acceso SSH. Desde el sistema se identifican ejecutables con permisos especiales que permiten escalar a root.",
        recommendations: [
          "Usar consultas parametrizadas o prepared statements.",
          "Validar y sanitizar todas las entradas del formulario.",
          "Implementar WAF para detectar y bloquear payloads SQLi.",
          "No almacenar contraseñas en texto claro en la base de datos.",
          "Aplicar principio de mínimo privilegio en cuentas de base de datos."
        ],
        conclusion: "La SQL Injection sigue siendo una vulnerabilidad crítica y prevalente. La combinación de bypass manual y automatización con sqlmap demuestra que un solo punto de entrada sin protección puede comprometer toda la infraestructura."
      },
      commands: [
        "nmap -sC -sV -p- <target>",
        "# Payload bypass: ' OR 1=1 --",
        "# Payload bypass 2: ' OR '1'='1",
        "sqlmap -u 'http://<target>/login' --cookie='session=<cookie>' --dbs",
        "sqlmap -u 'http://<target>/login' --cookie='session=<cookie>' -D <db> --tables",
        "sqlmap -u 'http://<target>/login' --cookie='session=<cookie>' -D <db> -T users --dump",
        "ssh <user>@<target>  # password: ********"
      ],
      evidence: [
        {
          title: "Reconocimiento inicial — Nmap",
          phase: "Reconocimiento y enumeración",
          description: "Escaneo de puertos que identifica el servicio web con el formulario de autenticación vulnerable.",
          image: "assets/writeups/img/sqli-sqlmap-01-nmap.png",
          caption: "Nmap identifica el servidor web objetivo.",
          command: "nmap -sC -sV -p- <target>",
          redacted: false
        },
        {
          title: "Acceso a la página web principal",
          phase: "Reconocimiento y enumeración",
          description: "Exploración del formulario de autenticación para identificar los campos de entrada.",
          image: "assets/writeups/img/sqli-sqlmap-02-acceso-web.png",
          caption: "Página de login de la aplicación web objetivo.",
          redacted: false
        },
        {
          title: "Prueba de payload SQLi — ' OR 1=1 --",
          phase: "Acceso inicial",
          description: "Primera prueba manual con payload de bypass clásico. Se evalúa el comportamiento de la aplicación.",
          image: "assets/writeups/img/sqli-sqlmap-03-prueba-payload.png",
          caption: "Payload ' OR 1=1 -- introducido en el formulario de login.",
          redacted: false
        },
        {
          title: "Resultado del primer payload",
          phase: "Acceso inicial",
          description: "Análisis de la respuesta del servidor ante el primer payload SQLi.",
          image: "assets/writeups/img/sqli-sqlmap-04-resultado-payload.png",
          caption: "Respuesta del servidor ante ' OR 1=1 --.",
          redacted: false
        },
        {
          title: "Payload alternativo — ' OR '1'='1",
          phase: "Acceso inicial",
          description: "Tras iterar payloads, se prueba la variante ' OR '1'='1 que logra el bypass de autenticación.",
          image: "assets/writeups/img/sqli-sqlmap-05-prueba-sqli2.png",
          caption: "Payload alternativo que consigue el bypass de autenticación.",
          redacted: false
        },
        {
          title: "Bypass de autenticación exitoso",
          phase: "Acceso inicial",
          description: "El payload ' OR '1'='1 logra acceso a la aplicación sin credenciales válidas.",
          image: "assets/writeups/img/sqli-sqlmap-06-resultado-bypass.png",
          caption: "Autenticación eludida mediante SQL Injection manual.",
          redacted: false
        },
        {
          title: "Ejecución de sqlmap",
          phase: "Acceso inicial",
          description: "Con la sesión activa, se lanza sqlmap para automatizar la enumeración de la base de datos.",
          image: "assets/writeups/img/sqli-sqlmap-07-ejecucion-sqlmap.png",
          caption: "sqlmap iniciando la enumeración automatizada.",
          command: "sqlmap -u 'http://<target>/login' --cookie='session=<cookie>' --dbs",
          redacted: false
        },
        {
          title: "Obtención de cookie de sesión",
          phase: "Acceso inicial",
          description: "La cookie de sesión del bypass se extrae para pasársela a sqlmap y que pueda autenticarse.",
          image: "assets/writeups/img/sqli-sqlmap-08-cookie.png",
          caption: "Cookie de sesión necesaria para que sqlmap funcione como usuario autenticado.",
          redacted: true
        },
        {
          title: "sqlmap con cookie de sesión",
          phase: "Acceso inicial",
          description: "sqlmap configurado con la cookie para interactuar con los endpoints autenticados.",
          image: "assets/writeups/img/sqli-sqlmap-09-sqlmap-cookie.png",
          caption: "sqlmap usando la cookie de sesión para la enumeración.",
          redacted: false
        },
        {
          title: "Resultado de sqlmap — bases de datos",
          phase: "Acceso inicial",
          description: "sqlmap enumera las bases de datos disponibles en el backend.",
          image: "assets/writeups/img/sqli-sqlmap-10-resultado-sqlmap.png",
          caption: "Bases de datos enumeradas por sqlmap.",
          redacted: false
        },
        {
          title: "Listado de tablas",
          phase: "Acceso inicial",
          description: "sqlmap enumera las tablas de la base de datos objetivo.",
          image: "assets/writeups/img/sqli-sqlmap-11-tablas.png",
          caption: "Tablas descubiertas en la base de datos.",
          command: "sqlmap ... -D <db> --tables",
          redacted: false
        },
        {
          title: "Columnas de la tabla de usuarios",
          phase: "Acceso inicial",
          description: "sqlmap enumera las columnas de la tabla de usuarios para extraer credenciales.",
          image: "assets/writeups/img/sqli-sqlmap-12-columnas.png",
          caption: "Columnas de la tabla users identificadas.",
          redacted: false
        },
        {
          title: "Extracción de usuarios",
          phase: "Acceso inicial",
          description: "sqlmap vuelca los registros de la tabla de usuarios. Las credenciales reales no se publican.",
          image: "assets/writeups/img/sqli-sqlmap-14-usuarios.png",
          caption: "Usuarios extraídos de la base de datos. Contraseñas saneadas.",
          command: "sqlmap ... -D <db> -T users --dump",
          redacted: true
        },
        {
          title: "Acceso SSH con credenciales recuperadas",
          phase: "Privilege Escalation",
          description: "Las credenciales extraídas de la base de datos permiten acceso SSH al sistema. Se obtiene flag de usuario.",
          image: "assets/writeups/img/sqli-sqlmap-15-acceso-ssh.png",
          caption: "Sesión SSH activa con credenciales de la base de datos. Flag de usuario saneada.",
          command: "ssh <user>@<target>  # password: ********",
          redacted: true
        },
        {
          title: "Enumeración de ejecutables para privesc",
          phase: "Privilege Escalation",
          description: "Se identifican ejecutables que pueden correr con permisos elevados, abriendo el vector de escalada.",
          image: "assets/writeups/img/sqli-sqlmap-16-privesc.png",
          caption: "Binarios con permisos especiales que permiten escalar privilegios.",
          redacted: false
        },
        {
          title: "Acceso root",
          phase: "Privilege Escalation",
          description: "Escalada a root exitosa. Flag saneada.",
          image: "assets/writeups/img/sqli-sqlmap-17-root.png",
          caption: "Shell root obtenida. Flag saneada.",
          redacted: true
        }
      ]
    },

    {
      id: "webshell-upload",
      title: "Webshell Upload: RCE y escalada root via sudo",
      url: "writeup.html?id=webshell-upload",
      category: "Seguridad Web",
      difficulty: "Media",
      readTime: "10 min",
      date: "2026",
      visibility: "Versión pública saneada",
      summary: "Explotación de subida de ficheros sin control: inyección de payload en comentario, upload de webshell PHP, RCE y escalada root mediante abuso de sudo.",
      tags: ["File Upload", "Webshell", "RCE", "PHP", "sudo", "Privilege Escalation", "Gobuster"],
      stack: ["Nmap", "Gobuster", "Burp Suite", "PHP", "Linux", "sudo"],
      cover: "assets/imgs/cover-webshell.svg",
      featured: false,
      labName: "Webshell Lab",
      target: "Aplicación web con CMS vulnerable",
      impact: "RCE y acceso root completo",
      killChain: ["Nmap", "Gobuster", "Panel admin", "Payload en comentario", "Upload webshell", "RCE", "sudo root"],
      sections: {
        executiveSummary: "El laboratorio documenta cómo una subida de ficheros sin restricciones permite cargar una webshell PHP, obtener ejecución remota de código y escalar a root mediante abuso de sudo. La cadena combina enumeración web, comprensión del CMS y explotación de misconfigurations.",
        scopeContext: "Entorno de laboratorio del módulo M4. El objetivo era explotar un CMS con panel de administración accesible y sin validación de tipo de fichero en la subida.",
        reconnaissanceEnumeration: [
          "Escaneo Nmap para identificar el servidor web.",
          "Enumeración de directorios con Gobuster.",
          "Lectura de robots.txt para identificar rutas ocultas.",
          "Acceso al panel de administración.",
          "Análisis del código fuente para entender la funcionalidad de subida."
        ],
        attackSurfaceAnalysis: "La aplicación permite la subida de ficheros sin validar el tipo MIME ni la extensión. El directorio de subida es accesible públicamente. La combinación permite subir y ejecutar código PHP arbitrario.",
        initialAccess: "Se inyecta un payload PHP en el campo de comentarios de un post para elevar privilegios en el CMS. Esto permite subir ficheros desde el panel de administración, incluida una webshell PHP.",
        privilegeEscalation: "Con RCE como www-data se descubre que el usuario puede ejecutar comandos con sudo sin contraseña. Esto permite obtener shell root directamente.",
        recommendations: [
          "Validar el tipo de fichero en servidor, nunca solo en cliente.",
          "Renombrar los ficheros subidos y eliminar la extensión original.",
          "Almacenar los ficheros subidos fuera del webroot.",
          "Aplicar política de sudo mínima y requerir contraseña siempre.",
          "Revisar permisos de ejecución en el contexto del servidor web."
        ],
        conclusion: "La subida de ficheros sin restricciones es una vulnerabilidad crítica cuando el directorio destino es accesible desde el navegador. La escalada mediante sudo sin contraseña agrava el impacto hasta compromiso total."
      },
      commands: [
        "nmap -sC -sV -p- <target>",
        "gobuster dir -u http://<target> -w /usr/share/wordlists/dirb/common.txt",
        "curl http://<target>/robots.txt",
        "# Payload en comentario para ganar permisos de admin en el CMS",
        "# Upload shell.php via panel admin",
        "curl http://<target>/uploads/shell.php?cmd=id",
        "sudo -l  # verificar permisos sudo",
        "sudo /bin/bash  # escalada root"
      ],
      evidence: [
        {
          title: "Reconocimiento inicial — Nmap",
          phase: "Reconocimiento y enumeración",
          description: "Escaneo de puertos que revela el servidor web con la aplicación vulnerable.",
          image: "assets/writeups/img/webshell-upload-01-nmap.png",
          caption: "Nmap identifica el servidor web objetivo.",
          command: "nmap -sC -sV -p- <target>",
          redacted: false
        },
        {
          title: "Acceso a la aplicación web",
          phase: "Reconocimiento y enumeración",
          description: "Exploración inicial de la web para entender la aplicación y sus funcionalidades.",
          image: "assets/writeups/img/webshell-upload-02-acceso-web.png",
          caption: "Interfaz principal de la aplicación web objetivo.",
          redacted: false
        },
        {
          title: "Enumeración de directorios con Gobuster",
          phase: "Reconocimiento y enumeración",
          description: "Gobuster descubre directorios y rutas ocultas, incluyendo el panel de administración.",
          image: "assets/writeups/img/webshell-upload-03-gobuster.png",
          caption: "Gobuster enumera rutas disponibles en el servidor.",
          command: "gobuster dir -u http://<target> -w /usr/share/wordlists/dirb/common.txt",
          redacted: false
        },
        {
          title: "Lectura de robots.txt",
          phase: "Reconocimiento y enumeración",
          description: "robots.txt revela rutas que el administrador quería ocultar a indexadores.",
          image: "assets/writeups/img/webshell-upload-04-robots-txt.png",
          caption: "Contenido de robots.txt con rutas administrativas.",
          redacted: false
        },
        {
          title: "Panel de administración",
          phase: "Reconocimiento y enumeración",
          description: "Acceso al panel de admin del CMS con credenciales débiles o por defecto.",
          image: "assets/writeups/img/webshell-upload-05-admin.png",
          caption: "Panel de administración del CMS accesible.",
          redacted: false
        },
        {
          title: "Página de aprendizaje del CMS",
          phase: "Reconocimiento y enumeración",
          description: "Exploración de la funcionalidad del CMS para entender el flujo de publicación y subida.",
          image: "assets/writeups/img/webshell-upload-06-learn.png",
          caption: "Página del CMS que revela funcionalidades de gestión de contenido.",
          redacted: false
        },
        {
          title: "Código fuente — funcionalidad de subida",
          phase: "Reconocimiento y enumeración",
          description: "Análisis del código fuente para identificar el endpoint de subida y la falta de validación.",
          image: "assets/writeups/img/webshell-upload-07-fuente.png",
          caption: "Código fuente revelando el endpoint de subida sin validación de tipo.",
          redacted: false
        },
        {
          title: "Fichero promote.php — escalada en CMS",
          phase: "Acceso inicial",
          description: "Identificación de la funcionalidad promote.php que permite elevar privilegios dentro del CMS.",
          image: "assets/writeups/img/webshell-upload-08-promote.png",
          caption: "promote.php permite escalar permisos dentro del CMS.",
          redacted: false
        },
        {
          title: "Payload PHP inyectado en comentario",
          phase: "Acceso inicial",
          description: "Se inyecta un payload PHP en el campo de comentarios para ganar acceso de administrador en el CMS.",
          image: "assets/writeups/img/webshell-upload-09-payload-comentario.png",
          caption: "Payload PHP en comentario para escalar privilegios en el CMS.",
          redacted: false
        },
        {
          title: "Perfil de autor comprometido",
          phase: "Acceso inicial",
          description: "Confirmación de que el payload funcionó y el perfil ahora tiene permisos de administración.",
          image: "assets/writeups/img/webshell-upload-10-author.png",
          caption: "Perfil de autor con permisos elevados en el CMS tras el payload.",
          redacted: false
        },
        {
          title: "Preparación de la webshell PHP",
          phase: "Acceso inicial",
          description: "Se prepara el fichero shell.php con una webshell básica para ejecutar comandos remotos.",
          image: "assets/writeups/img/webshell-upload-11-shell-php.png",
          caption: "Contenido del fichero shell.php con la webshell PHP.",
          redacted: false
        },
        {
          title: "Subida de la webshell",
          phase: "Acceso inicial",
          description: "La webshell se sube al servidor a través del panel de administración sin ninguna restricción de tipo.",
          image: "assets/writeups/img/webshell-upload-12-subida-shell.png",
          caption: "Fichero shell.php subido exitosamente al servidor.",
          redacted: false
        },
        {
          title: "RCE confirmado — whoami",
          phase: "Acceso inicial",
          description: "Acceso a la webshell en el servidor y confirmación de ejecución de código remoto como www-data.",
          image: "assets/writeups/img/webshell-upload-13-whoami.png",
          caption: "Comando whoami ejecutado remotamente: contexto www-data.",
          command: "curl http://<target>/uploads/shell.php?cmd=whoami",
          redacted: false
        },
        {
          title: "Variables de entorno",
          phase: "Acceso inicial",
          description: "Lectura de variables de entorno para recopilar información del sistema.",
          image: "assets/writeups/img/webshell-upload-14-env.png",
          caption: "Variables de entorno del servidor obtenidas via RCE.",
          command: "curl http://<target>/uploads/shell.php?cmd=env",
          redacted: false
        },
        {
          title: "Exploración del sistema de ficheros",
          phase: "Privilege Escalation",
          description: "Navegación por el sistema de ficheros en busca de flags y vectores de escalada.",
          image: "assets/writeups/img/webshell-upload-15-ls.png",
          caption: "Listado de directorios accesibles desde el contexto web.",
          redacted: false
        },
        {
          title: "Flag de usuario (saneada)",
          phase: "Privilege Escalation",
          description: "Flag de usuario encontrada. Valor saneado antes de publicación.",
          image: "assets/writeups/img/webshell-upload-16-flag.png",
          caption: "Flag de usuario. HTB{REDACTED}.",
          redacted: true
        },
        {
          title: "Permisos sudo disponibles",
          phase: "Privilege Escalation",
          description: "Verificación de permisos sudo: el usuario www-data puede ejecutar comandos sin contraseña.",
          image: "assets/writeups/img/webshell-upload-17-sudo.png",
          caption: "sudo -l revela que www-data puede ejecutar comandos sin contraseña.",
          command: "sudo -l",
          redacted: false
        },
        {
          title: "Escalada a root mediante sudo",
          phase: "Privilege Escalation",
          description: "Abuso de permisos sudo para obtener shell root. Flag saneada.",
          image: "assets/writeups/img/webshell-upload-18-root.png",
          caption: "Shell root obtenida mediante sudo. Flag de root saneada.",
          command: "sudo /bin/bash",
          redacted: true
        },
        {
          title: "Flag root en fichero de resultados",
          phase: "Privilege Escalation",
          description: "Flag de root localizada en el sistema. Valor saneado.",
          image: "assets/writeups/img/webshell-upload-21-root-flag.png",
          caption: "Flag de root obtenida. HTB{REDACTED}.",
          redacted: true
        }
      ]
    }
  ];

  labs.forEach(function (lab) {
    var exists = window.WRITEUPS.some(function (w) { return w.id === lab.id; });
    if (!exists) window.WRITEUPS.push(lab);
  });
})();
