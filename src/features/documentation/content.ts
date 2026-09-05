import type { Locale } from '../../shared/i18n'

type Localized = Record<Locale, string>
export type SectionIcon = 'processes' | 'network' | 'files' | 'review'
export type Article = {
  slug: string
  title: Localized
  intro: Localized
  sections: {
    id: string
    title: Localized
    paragraphs: Localized[]
    callout?: {
      title: Localized
      body: Localized
    }
    diagram?: {
      source: Localized
      alt: Localized
    }
    code?: string | Localized
    codeLanguage?: 'bash' | 'yaml'
    icon?: SectionIcon
    headingLevel?: 2 | 3
    definitions?: { term: Localized; description: Localized }[]
  }[]
  related: string[]
}

export const controls = {
  en: {
    skip: 'Skip to article',
    application: 'Open application',
    articles: 'Articles',
    onPage: 'On this page',
    related: 'Continue reading',
    overview: 'Documentation overview',
    notFound: 'Article not found',
    notFoundHelp:
      'This article does not exist. Choose an article from the navigation or return to the overview.',
    copy: 'Copy example',
    copied: 'Copied.',
    copyFailed: 'Copy failed. Select and copy the example manually.',
    example: 'Code example',
    repository: 'Open Helm chart sources on GitHub',
  },
  ru: {
    skip: 'Перейти к статье',
    application: 'Открыть приложение',
    articles: 'Статьи',
    onPage: 'На этой странице',
    related: 'Читайте также',
    overview: 'Обзор документации',
    notFound: 'Статья не найдена',
    notFoundHelp: 'Такой статьи нет. Выберите статью в навигации или вернитесь к обзору.',
    copy: 'Копировать пример',
    copied: 'Скопировано.',
    copyFailed: 'Не удалось скопировать. Выделите и скопируйте пример вручную.',
    example: 'Пример кода',
    repository: 'Открыть исходники Helm-чартов на GitHub',
  },
}

export const articles: Article[] = [
  {
    slug: 'overview',
    title: {
      en: 'Meet Okoscope',
      ru: 'Знакомство с Okoscope',
    },
    intro: {
      en: 'See what your applications actually do in Kubernetes, dig into what changed, and keep the evidence next to the question.',
      ru: 'Посмотрите, чем на самом деле заняты ваши приложения в Kubernetes, разберитесь в изменениях и держите данные рядом с вопросом.',
    },
    sections: [
      {
        id: 'purpose',
        title: {
          en: 'What you can learn',
          ru: 'Что можно узнать',
        },
        paragraphs: [
          {
            en: 'Okoscope watches the workloads you select, using an eBPF agent that runs on your cluster nodes. When something looks off — a process you did not expect, a connection to a new destination, unfamiliar file activity, a container that keeps restarting — you start by picking an Application and a time window, and then open the events behind whatever the page is showing you.',
            ru: 'Okoscope наблюдает за теми нагрузками, которые вы выбрали: на узлах кластера для этого работает агент eBPF. Если что-то выглядит странно — незнакомый процесс, соединение с новым адресом, непонятная активность с файлами, постоянно перезапускающийся контейнер, — начните с выбора приложения и временного интервала, а затем откройте события, на которых построено то, что вы видите.',
          },
          {
            en: 'Behavior that repeats is collected into groups, so you can get a picture of what a workload does without reading every single event. Comparing two releases shows what changed between them, as far as the retained data goes. Treat what you find as a place to start looking, not as a verdict: it points you at the interesting parts, it does not prove that a workload is safe or malicious.',
            ru: 'Повторяющееся поведение объединяется в группы, поэтому понять, чем занята нагрузка, можно и не читая каждое событие подряд. Сравнение двух релизов показывает, что между ними изменилось — насколько об этом позволяют судить сохранённые данные. Относитесь к находкам как к месту, откуда начинать разбираться: они подсказывают, куда смотреть, но не доказывают, что нагрузка безопасна или, наоборот, вредоносна.',
          },
        ],
      },
      {
        id: 'vocabulary',
        title: {
          en: 'Your workspace',
          ru: 'Ваше рабочее пространство',
        },
        paragraphs: [],
        definitions: [
          {
            term: { en: 'Organization', ru: 'Организация' },
            description: {
              en: 'decides who owns the data and who is allowed to see it.',
              ru: 'определяет, кому принадлежат данные и кто может их видеть.',
            },
          },
          {
            term: { en: 'Project', ru: 'Проект' },
            description: {
              en: 'keeps related Applications together.',
              ru: 'держит связанные приложения вместе.',
            },
          },
          {
            term: { en: 'Application', ru: 'Приложение' },
            description: {
              en: 'is the component whose runtime behavior you are looking at.',
              ru: 'компонент, поведение которого вы изучаете.',
            },
          },
          {
            term: { en: 'Cluster', ru: 'Кластер' },
            description: {
              en: 'is one Kubernetes installation.',
              ru: 'одна установка Kubernetes.',
            },
          },
          {
            term: { en: 'Workload', ru: 'Рабочая нагрузка' },
            description: {
              en: 'is the Deployment inside that Cluster the agent watches.',
              ru: 'тот Deployment внутри кластера, за которым наблюдает агент.',
            },
          },
          {
            term: { en: 'Event', ru: 'Событие' },
            description: {
              en: 'is a single thing the agent saw.',
              ru: 'одно наблюдение, которое зафиксировал агент.',
            },
          },
          {
            term: { en: 'Runtime group', ru: 'Группа событий' },
            description: {
              en: 'collects the events that describe the same behavior.',
              ru: 'собирает события, описывающие одно и то же поведение.',
            },
          },
          {
            term: { en: 'Inventory', ru: 'Инвентаризация' },
            description: {
              en: 'lists what was seen: executables, destinations, file paths.',
              ru: 'перечисляет увиденное: исполняемые файлы, сетевые адреса, пути к файлам.',
            },
          },
          {
            term: { en: 'Release', ru: 'Релиз' },
            description: {
              en: 'is a set of deployed images together with how they behaved; it is not a source-code diff.',
              ru: 'набор развёрнутых образов вместе с тем, как они себя вели; это не сравнение исходного кода.',
            },
          },
        ],
      },
      {
        id: 'start',
        title: {
          en: 'Choose your starting point',
          ru: 'С чего начать',
        },
        paragraphs: [
          {
            en: 'Choose Okoscope Cloud to use our server at https://okoscope.com: install only the agent in your Kubernetes cluster and send observations to https://grpc.okoscope.com:443. Choose Self-hosted to operate your own server, web interface and PostgreSQL with your own domains. Both paths require a compatible cluster; read Compatibility and limits before installation.',
            ru: 'Выберите Okoscope Cloud, чтобы пользоваться нашим сервером на https://okoscope.com: в своём Kubernetes-кластере установите только агента, который отправляет наблюдения на https://grpc.okoscope.com:443. Выберите Self-hosted, чтобы управлять собственным сервером, веб-интерфейсом и PostgreSQL со своими доменами. В обоих случаях нужен совместимый кластер; перед установкой прочитайте раздел о совместимости и ограничениях.',
          },
        ],
      },
    ],
    related: ['quick-start', 'self-hosting', 'how-it-works', 'compatibility-and-limits'],
  },
  {
    slug: 'how-it-works',
    title: {
      en: 'How it works',
      ru: 'Принцип работы',
    },
    intro: {
      en: 'What happens between a workload running in Kubernetes and the evidence you read in the interface.',
      ru: 'Что происходит между работающей нагрузкой в Kubernetes и данными, которые вы видите в интерфейсе.',
    },
    sections: [
      {
        id: 'flow',
        title: {
          en: 'Agent → server → interface',
          ru: 'Агент → сервер → интерфейс',
        },
        paragraphs: [
          {
            en: 'On every node that takes part, the agent attaches eBPF probes and watches the event classes you enabled. Kubernetes metadata and cgroup information tell it which container and which Deployment-owned workload an observation belongs to. A workload is in scope only when it matches the namespace, kind, name and labels you configured, so everything else on the node stays outside.',
            ru: 'На каждом участвующем узле агент подключает зонды eBPF и наблюдает только те классы событий, которые вы включили. Метаданные Kubernetes и сведения из cgroup подсказывают ему, какому контейнеру и какой нагрузке Deployment принадлежит наблюдение. Нагрузка попадает в область наблюдения, только если совпадают заданные namespace, kind, name и labels, — всё остальное на узле остаётся за её пределами.',
          },
          {
            en: 'What it sees goes to the server in bounded batches over gRPC, authenticated with an Application credential. The server checks the token and decides for itself which tenant and Application the data belongs to, stores the evidence in PostgreSQL and serves it through the API. The web interface never shows you anything except what the server returned.',
            ru: 'Увиденное агент отправляет на сервер ограниченными по размеру пакетами через gRPC, представляясь токеном приложения. Сервер проверяет токен и сам определяет, к какой организации и какому приложению относятся данные, сохраняет их в PostgreSQL и отдаёт через API. Веб-интерфейс показывает ровно то, что вернул сервер, и ничего сверх этого.',
          },
        ],
        diagram: {
          source: {
            en: '/documentation/architecture-birds-eye.en.svg',
            ru: '/documentation/architecture-birds-eye.ru.svg',
          },
          alt: {
            en: 'Bird’s-eye architecture diagram showing runtime data flowing from the Okoscope node agent through the server and PostgreSQL to the web interface.',
            ru: 'Архитектурная диаграмма: поток данных среды выполнения проходит от агента Okoscope на узле через сервер и PostgreSQL к веб-интерфейсу.',
          },
        },
      },
      {
        id: 'identity',
        title: {
          en: 'Attribution and release identity',
          ru: 'Привязка к нагрузкам и релизам',
        },
        paragraphs: [
          {
            en: 'One node agent can serve several Applications at once, and each credential gets its own bounded stream. The cluster is identified by the UID of the kube-system namespace. Attribution follows the ownership chain Pod → ReplicaSet → Deployment, so a Pod owned by anything else is not a supported workload and will not show up as one.',
            ru: 'Один агент на узле может обслуживать несколько приложений сразу, и на каждый токен создаётся свой ограниченный поток. Кластер определяется по UID пространства имён kube-system. Привязка идёт по цепочке владения Pod → ReplicaSet → Deployment, поэтому Pod с другим владельцем не считается поддерживаемой нагрузкой и в этом качестве не появится.',
          },
          {
            en: 'For releases, the image digests reported by Kubernetes win; a release string set by hand is only a fallback. During a rolling update several images live side by side for a while, so before you conclude anything, check which release the evidence actually belongs to and which window it was observed in.',
            ru: 'Для привязки к релизу приоритет у дайджестов образов из Kubernetes; заданная вручную строка release — только запасной вариант. При постепенном обновлении несколько образов какое-то время сосуществуют, поэтому, прежде чем делать выводы, проверяйте, к какому релизу относятся данные и в каком интервале они наблюдались.',
          },
        ],
      },
      {
        id: 'grouping',
        title: {
          en: 'What a group tells you',
          ru: 'Что показывает группа',
        },
        paragraphs: [
          {
            en: 'A group keeps the identity of the behavior, how many times it was seen, and when it was seen first and last. Open it to look at the examples that are still stored and at the workload context around them. An inventory row is something that was observed, not the result of an audit: it is not a list of installed software, and it is certainly not every file on disk.',
            ru: 'Группа хранит идентичность поведения, число наблюдений и время первого и последнего из них. Откройте её, чтобы посмотреть сохранившиеся примеры и контекст нагрузки вокруг них. Строка инвентаризации — это то, что удалось увидеть, а не результат аудита: она не перечисляет установленное ПО и уж тем более не перечисляет все файлы на диске.',
          },
          {
            en: 'What you can see depends on aggregation, the filters in your configuration, rate limits and retention. Details can expire while the historical count stays above zero, so a group with a number but no examples is normal. And an empty list means nothing was retained for that scope, not that nothing happened.',
            ru: 'Что именно вы увидите, зависит от агрегации, настроенных фильтров, ограничений скорости и сроков хранения. Подробности могут удалиться, а исторический счётчик остаться положительным, поэтому группа с числом, но без примеров — это нормально. А пустой список означает лишь, что для выбранной области ничего не сохранилось, а не что ничего не происходило.',
          },
        ],
      },
    ],
    related: ['capabilities', 'data-and-security', 'quick-start'],
  },
  {
    slug: 'quick-start',
    title: {
      en: 'Okoscope Cloud — Quick start',
      ru: 'Okoscope Cloud — Быстрый старт',
    },
    intro: {
      en: 'Connect your Kubernetes cluster to our Okoscope Cloud server. You install only the agent; we operate the server, web interface and database. To run your own server, follow Self-hosted.',
      ru: 'Подключите свой Kubernetes-кластер к нашему серверу Okoscope Cloud. Вы устанавливаете только агента; сервер, веб-интерфейс и базу данных обслуживаем мы. Для собственного сервера выберите Self-hosted.',
    },
    sections: [
      {
        id: 'access',
        title: {
          en: '1. Obtain access and create an Application',
          ru: '1. Получите доступ и создайте приложение',
        },
        paragraphs: [
          {
            en: 'If an Application has no worker observations yet, its Worker nodes section offers a Connect agent button. It opens the connection wizard, where you select the Project and Application.',
            ru: 'Если у приложения ещё нет наблюдений рабочих узлов, в разделе «Рабочие узлы» доступна кнопка «Подключить агента». Она открывает мастер подключения, в котором нужно выбрать проект и приложение.',
          },
          {
            en: 'Sign in or register at https://okoscope.com, create an Organization, then a Project and an Application. Registration creates an organization owner, not a system administrator. If you already belong to an Organization, ask its owner to create the Project and Application. Open https://okoscope.com/onboarding using Connect agent in the main navigation. Allow outbound connections from the agent to https://grpc.okoscope.com:443.',
            ru: 'Войдите или зарегистрируйтесь на https://okoscope.com, создайте организацию, затем проект и приложение. При регистрации вы становитесь владельцем организации, а не системным администратором. Если вы уже состоите в организации, попросите владельца создать проект и приложение. Откройте https://okoscope.com/onboarding через «Подключение агента» в основном меню. Разрешите исходящие соединения агента к https://grpc.okoscope.com:443.',
          },
          {
            en: 'Open Connect agent. The wizard reads Projects, Applications and installation state from the server, so reloading the page continues where you left off instead of creating duplicates. Cluster name is saved with the installation and passed to the agent as identity.clusterName, while the Kubernetes UID remains the authoritative cluster identity. Workload namespace says where the Deployment lives; then select that one Deployment by its exact name or by a bounded comma-separated key=value label set. Advanced observation settings are informational here: the chart applies the stated defaults, and you can change them after connection. The server hands you the compatible chart version, the endpoint and the Secret convention; no system administrator credential is involved.',
            ru: 'Откройте «Подключение агента». Мастер берёт проекты, приложения и состояние установки с сервера, поэтому перезагрузка страницы продолжает начатое, а не создаёт дубликаты. Название кластера сохраняется в установке и передаётся агенту как identity.clusterName, но авторитетным идентификатором остаётся Kubernetes UID. Namespace нагрузки указывает, где находится Deployment; затем выберите этот единственный Deployment по точному имени либо по ограниченному набору меток key=value через запятую. «Расширенные настройки наблюдения» здесь информационные: чарт применяет указанные значения по умолчанию, изменить их можно после подключения. Совместимую версию чарта, endpoint и правила именования Secret подскажет сервер; системный административный токен для этого не нужен.',
          },
        ],
      },
      {
        id: 'secret',
        title: {
          en: '2. Create the credential Secret',
          ru: '2. Создайте Secret с токеном',
        },
        paragraphs: [
          {
            en: 'The chart takes Application credentials only from a Kubernetes Secret that already exists. There is deliberately no value for the token itself, because Helm keeps whatever you pass it in the release Secret. The Connect agent wizard provides the exact namespace, Secret name and key command. Read the token without echoing it, create the Secret, then clear the shell variable. The example uses syntax shared by Bash and zsh. The token has no business being in a values file, a command argument, a ConfigMap, Git, a screenshot or a log.',
            ru: 'Токены приложений чарт берёт только из уже существующего Kubernetes Secret. Параметра для самого токена намеренно нет: всё, что вы передадите через values, Helm сохранит в Secret релиза. Мастер «Подключение агента» выдаёт команду с точными namespace, именем Secret и ключом. Считайте токен без вывода на экран, создайте Secret, затем очистите переменную shell. В примере используется общий для Bash и zsh синтаксис. Токену нечего делать в values-файле, аргументе команды, ConfigMap, Git, скриншоте или журнале.',
          },
        ],
        codeLanguage: 'bash',
        code: `kubectl create namespace okoscope-system
printf "Okoscope Application token: " >&2
IFS= read -rs OKOSCOPE_APPLICATION_TOKEN
printf '\\n' >&2
kubectl -n okoscope-system create secret generic okoscope-application-credentials \\
  --from-literal=payment-api="$OKOSCOPE_APPLICATION_TOKEN"
unset OKOSCOPE_APPLICATION_TOKEN`,
      },
      {
        id: 'deploy',
        title: {
          en: '3. Install and check',
          ru: '3. Установите и проверьте',
        },
        paragraphs: [
          {
            en: 'Install the versioned okoscope-agent OCI chart. You supply four things: a reachable TLS gRPC endpoint, a cluster name, a bounded Deployment selector, and a reference to the Secret you just created. The chart builds the rest — ServiceAccount, read-only workload RBAC, the full agent configuration and the DaemonSet — so there are no Kubernetes manifests for you to edit. Pin the chart version your Okoscope server asks for.',
            ru: 'Установите версионированный OCI-чарт okoscope-agent. От вас нужны четыре вещи: доступный TLS gRPC endpoint, имя кластера, ограниченный селектор Deployment и ссылка на только что созданный Secret. Всё остальное чарт соберёт сам — ServiceAccount, RBAC только для чтения нагрузок, полную конфигурацию агента и DaemonSet, — так что править Kubernetes-манифесты не придётся. Зафиксируйте ту версию чарта, которую называет ваш сервер Okoscope.',
          },
          {
            en: 'Okoscope Cloud uses a publicly trusted TLS certificate: keep system certificate trust and do not create a private CA Secret. Use the complete command generated by https://okoscope.com/onboarding with its compatible chart version and your workload settings. Read Data and security before installation: the eBPF agent needs node-level capabilities and host mounts, although Kubernetes API access is read-only.',
            ru: 'Okoscope Cloud использует публично доверенный TLS-сертификат: оставьте системное доверие сертификатам, Secret с частным CA создавать не нужно. Используйте полную команду из https://okoscope.com/onboarding с совместимой версией чарта и настройками вашей нагрузки. Перед установкой прочитайте раздел о данных и безопасности: агенту eBPF нужны права уровня узла и host mounts, хотя доступ к Kubernetes API у него только на чтение.',
          },
        ],
        callout: {
          title: {
            en: 'Important',
            ru: 'Важно',
          },
          body: {
            en: '<OKOSCOPE_VERSION> is a placeholder, not an environment variable. Copy the actual version from the command generated by Connect agent; do not run the placeholder literally. Adapt the sample cluster and workload names to your cluster. If Cloud configuration is unavailable, contact the Okoscope operator; you do not need to install or configure the server.',
            ru: '<OKOSCOPE_VERSION> — плейсхолдер, а не переменная окружения. Возьмите конкретную версию из команды мастера «Подключение агента»; не выполняйте плейсхолдер буквально. Замените примерные имена кластера и нагрузки своими. Если конфигурация Cloud недоступна, обратитесь к оператору Okoscope; устанавливать или настраивать сервер вам не нужно.',
          },
        },
        codeLanguage: 'bash',
        code: `helm upgrade --install okoscope-agent \\
  oci://ghcr.io/ihippik/charts/okoscope-agent \\
  --version <OKOSCOPE_VERSION> \\
  --namespace okoscope-system \\
  --set server.endpoint=https://grpc.okoscope.com:443 \\
  --set identity.clusterName=production \\
  --set 'workloads[0].namespace=production' \\
  --set 'workloads[0].kind=Deployment' \\
  --set 'workloads[0].name=payment-api' \\
  --set 'workloads[0].credentialSecret.name=okoscope-application-credentials' \\
  --set 'workloads[0].credentialSecret.key=payment-api'

kubectl -n okoscope-system rollout status daemonset/okoscope-agent-okoscope-agent --timeout=5m
kubectl -n okoscope-system logs daemonset/okoscope-agent-okoscope-agent --tail=100`,
      },
      {
        id: 'agent-variants',
        title: {
          en: 'Multiple Applications and labels',
          ru: 'Несколько приложений и labels',
        },
        paragraphs: [
          {
            en: 'One agent release can cover up to 32 Applications. Add a workloads entry per Application: each entry picks exactly one Deployment — by name, or by a bounded labels map — and points at its own Secret name and key. For a private registry, reference an existing pull Secret through imagePullSecrets. No credential value ever belongs in the values file.',
            ru: 'Один релиз агента может обслуживать до 32 приложений. Добавьте по элементу workloads на приложение: каждый выбирает ровно один Deployment — по имени или по ограниченному набору labels — и ссылается на собственные имя Secret и ключ. Для private registry укажите существующий pull Secret через imagePullSecrets. Самих токенов в values-файле быть не должно никогда.',
          },
          {
            en: 'For Cloud, keep server.developmentPlaintext off and use https://grpc.okoscope.com:443 with system trust. Private CA configuration applies to Self-hosted installations and is described in that guide.',
            ru: 'Для Cloud оставляйте server.developmentPlaintext выключенным и используйте https://grpc.okoscope.com:443 с системным доверием. Настройка частного CA относится к Self-hosted и описана в соответствующем руководстве.',
          },
        ],
      },
      {
        id: 'first-event',
        title: {
          en: '4. Confirm the first observation',
          ru: '4. Подтвердите первое наблюдение',
        },
        paragraphs: [
          {
            en: 'Once the agent is connected, make the application do something: a normal request, or a controlled test that starts a process or opens a connection. Processes that were already sitting idle do not turn into execution events retroactively. Then open the Application, choose a recent time window, and look in Runtime groups or Inventory for an event with the workload and timestamp you expect.',
            ru: 'Когда агент подключился, заставьте приложение что-нибудь сделать: обычный запрос или контролируемый тест, который запускает процесс либо открывает соединение. Процессы, которые к этому моменту просто работали, не превращаются задним числом в события запуска. Затем откройте приложение, выберите недавний интервал и найдите в группах событий или инвентаризации запись с ожидаемой нагрузкой и временем.',
          },
          {
            en: 'Success means a connected stream plus an event attributed to your Application; a running Pod on its own proves nothing. If the list stays empty, go to Troubleshooting rather than widening collection in the hope that something turns up. Turn on DNS or the experimental file observation only after this baseline works.',
            ru: 'Успех — это подключённый поток и событие, привязанное к вашему приложению; сам по себе работающий Pod ничего не доказывает. Если список остаётся пустым, идите в раздел устранения проблем, а не расширяйте сбор в надежде, что что-нибудь появится. DNS и экспериментальное наблюдение файлов включайте только после того, как базовый сценарий заработал.',
          },
        ],
      },
    ],
    related: ['compatibility-and-limits', 'self-hosting', 'troubleshooting', 'data-and-security'],
  },
  {
    slug: 'self-hosting',
    title: {
      en: 'Self-hosted — Deployment',
      ru: 'Self-hosted — Самостоятельное развёртывание',
    },
    intro: {
      en: 'Operate your own Okoscope server, web interface and PostgreSQL with your own web and gRPC domains. To use our server and install only agents, choose Okoscope Cloud.',
      ru: 'Управляйте собственным сервером, веб-интерфейсом и PostgreSQL со своими доменами для сайта и gRPC. Чтобы пользоваться нашим сервером и устанавливать только агентов, выберите Okoscope Cloud.',
    },
    sections: [
      {
        id: 'components',
        title: {
          en: 'What Okoscope installs',
          ru: 'Что устанавливает Okoscope',
        },
        paragraphs: [
          {
            en: 'The okoscope OCI chart installs the server, the web interface, a migration hook and, if you ask for them, the agent and ingress resources. It does not install PostgreSQL. Before you start, have a supported PostgreSQL database that the cluster can reach, and a Kubernetes Secret holding its connection URL.',
            ru: 'OCI-чарт okoscope устанавливает сервер, веб-интерфейс, hook миграций и, если попросить, ресурсы агента и ingress. PostgreSQL он не устанавливает. К началу работы у вас должны быть поддерживаемая база PostgreSQL, доступная из кластера, и Kubernetes Secret со строкой подключения к ней.',
          },
          {
            en: 'The database stays entirely yours: you or your provider provision, secure, monitor, back up, restore, upgrade and delete it. Installing, upgrading, rolling back or uninstalling the Okoscope chart never creates, changes or deletes the database or the Secret you made for it. The Kustomize manifests still sitting in the repository are a legacy internal mechanism, not the supported way to build a new installation.',
            ru: 'База целиком остаётся вашей: вы или ваш провайдер её создаёте, защищаете, мониторите, резервируете и восстанавливаете, обновляете и удаляете. Установка, обновление, откат или удаление чарта Okoscope никогда не создаёт, не меняет и не удаляет ни базу, ни созданный вами для неё Secret. Kustomize-манифесты, которые ещё лежат в репозитории, — устаревающий внутренний механизм, а не поддерживаемый способ развернуть новую установку.',
          },
        ],
      },
      {
        id: 'database',
        title: {
          en: 'Database and secrets first',
          ru: 'Сначала база данных и секреты',
        },
        paragraphs: [
          {
            en: 'Create the namespace and the database Secret before Helm runs. The chart accepts only database.existingSecret and database.urlKey — there is no value for the URL itself. The example below reads the URL without echoing it and keeps it out of Helm values and out of any committed file.',
            ru: 'Namespace и Secret с базой создайте до запуска Helm. Чарт принимает только database.existingSecret и database.urlKey — параметра для самой строки подключения нет. Пример ниже читает URL без вывода на экран и не оставляет его ни в values, ни в файле под контролем версий.',
          },
          {
            en: 'By default the chart generates its internal cryptographic keys and keeps them across upgrades. For production GitOps and disaster recovery, supply an externally managed Secret instead: rendering templates offline cannot use Helm lookup, so generated keys would not survive. Back those keys up separately from PostgreSQL, because losing them is a different problem from losing the database and neither backup covers the other.',
            ru: 'По умолчанию чарт сам генерирует внутренние криптографические ключи и сохраняет их при обновлениях. Для production GitOps и аварийного восстановления передайте вместо этого внешний Secret: при офлайн-рендеринге шаблонов Helm lookup недоступен, поэтому сгенерированные ключи не сохранятся. Резервируйте эти ключи отдельно от PostgreSQL: потерять их — совсем не то же самое, что потерять базу, и одна копия не заменяет другую.',
          },
        ],
        codeLanguage: 'bash',
        code: `kubectl create namespace okoscope-system
printf "PostgreSQL URL: " >&2
IFS= read -rs OKOSCOPE_DATABASE_URL
printf '\\n' >&2
kubectl -n okoscope-system create secret generic okoscope-database \\
  --from-literal=database-url="$OKOSCOPE_DATABASE_URL"
unset OKOSCOPE_DATABASE_URL`,
      },
      {
        id: 'claim',
        title: { en: 'Claim a fresh installation', ru: 'Активируйте новую установку' },
        paragraphs: [
          {
            en: 'When you first open a new installation, Okoscope asks for the setup token that the chart keeps in a Secret, and creates the first owner, the Organization and a Project in a single operation. Helm prints the command that retrieves the token in its NOTES output; do not move that token into a URL query, a values file or your shell history. Once the first owner exists, setup closes for good and the normal sign-in page takes over.',
            ru: 'При первом открытии новой установки Okoscope спрашивает setup-токен, который чарт хранит в Secret, и одной операцией создаёт первого владельца, организацию и проект. Команду для получения токена Helm печатает в NOTES; не переносите этот токен ни в query-параметр URL, ни в values-файл, ни в историю shell. Как только первый владелец создан, setup закрывается навсегда и его место занимает обычная страница входа.',
          },
          {
            en: 'Public registration is off by default, with or without Web ingress. If you do want open signup, set server.registrationEnabled=true in Helm values: every signup then creates its own Organization together with its owner, and setup plays no part in it.',
            ru: 'Публичная регистрация по умолчанию выключена — независимо от того, включён Web ingress или нет. Если открытая регистрация всё же нужна, задайте server.registrationEnabled=true в values: тогда каждая регистрация создаёт свою организацию вместе с её владельцем, а setup в этом не участвует.',
          },
        ],
      },
      {
        id: 'rollout',
        title: {
          en: 'Install and verify',
          ru: 'Установите и проверьте',
        },
        paragraphs: [
          {
            en: 'Install a pinned chart version. Before an install and before every upgrade, a migration hook runs with the database Secret: if the database is unreachable or the migration fails, the release stops right there, and the server is never rolled out on top of a failed migration. Re-running the same release is safe. When the hook fails, read its Job, fix the external database or its permissions, and try again.',
            ru: 'Устанавливайте зафиксированную версию чарта. Перед установкой и перед каждым обновлением запускается hook миграций с Secret базы: если база недоступна или миграция не удалась, релиз на этом останавливается, и сервер поверх неуспешной миграции не разворачивается. Повторный запуск той же версии безопасен. Если hook упал, изучите его Job, исправьте внешнюю базу или права и повторите.',
          },
          {
            en: 'A default installation is reachable only inside the cluster, so use port-forward for the first check. Ingress is opt-in and deliberate: separate HTTPS hosts for Web/API and for TLS gRPC, a supported ingress class, and TLS Secrets that already exist. Remote agents can be given an existing CA Secret. Certificate automation and private registries are chart settings too — configure them there rather than editing the rendered resources.',
            ru: 'По умолчанию установка доступна только внутри кластера, поэтому для первой проверки используйте port-forward. Ingress включается отдельно и осознанно: разные HTTPS-хосты для Web/API и для TLS gRPC, поддерживаемый ingress class и уже существующие TLS Secrets. Удалённым агентам можно передать существующий Secret с CA. Автоматизация сертификатов и private registry — тоже параметры чарта: настраивайте их там, а не правьте отрендеренные ресурсы.',
          },
          {
            en: 'When the chart creates the Web ingress, it automatically trusts the browser Origin derived from this installation’s ingress.web.host: https://<ingress.web.host> when ingress.web.tlsSecret is set, and http://<ingress.web.host> otherwise. If an external ingress, reverse proxy or alternate browser address exposes Web/API, add every such Origin to server.corsOrigins explicitly. An Origin is exactly scheme://host plus a non-default port when present; wildcards, paths, queries, fragments and trailing slashes are not accepted.',
            ru: 'Когда Web ingress создаёт чарт, он автоматически доверяет Origin браузера, выведенному из ingress.web.host именно этой установки: https://<ingress.web.host>, если задан ingress.web.tlsSecret, и http://<ingress.web.host> в противном случае. Если Web/API публикует внешний ingress, reverse proxy или альтернативный адрес, явно добавьте каждый такой Origin в server.corsOrigins. Origin — это строго scheme://host и, при наличии, нестандартный порт; wildcard, пути, query-параметры, fragment и завершающий слеш недопустимы.',
          },
          {
            en: 'Wait for Helm and for the Deployments, then forward the Web service. The installation is ready when /readyz answers, /api/v1/build-info reports the expected version, the interface opens, and a documentation deep link still works after a refresh. A local agent is optional; if you install one, use the same existing-Secret mapping as in Quick start.',
            ru: 'Дождитесь Helm и готовности Deployments, затем перенаправьте локальный порт на Web Service. Установка готова, когда отвечает /readyz, /api/v1/build-info сообщает ожидаемую версию, интерфейс открывается, а прямая ссылка на документацию продолжает работать после обновления страницы. Локальный агент необязателен; если ставите его, используйте ту же привязку к существующему Secret, что и в быстром старте.',
          },
        ],
        codeLanguage: 'bash',
        code: `helm upgrade --install okoscope \\
  oci://ghcr.io/ihippik/charts/okoscope \\
  --version <OKOSCOPE_VERSION> \\
  --namespace okoscope-system \\
  --set database.existingSecret=okoscope-database \\
  --set database.urlKey=database-url \\
  --wait --timeout 10m

kubectl -n okoscope-system rollout status deployment/okoscope-server --timeout=5m
kubectl -n okoscope-system rollout status deployment/okoscope-web --timeout=5m
kubectl -n okoscope-system port-forward service/okoscope-web 8080:80`,
      },
      {
        id: 'helm-values',
        title: { en: 'Helm values for both charts', ru: 'Values обоих Helm-чартов' },
        paragraphs: [
          {
            en: 'There are two charts and they share a version: okoscope brings the server and the web interface, okoscope-agent brings the node agent. The commands below print the complete defaults for the exact version you are about to install, and docs/helm-values.md in the repository lists every value with its validation limits. What follows here is the part you are most likely to touch.',
            ru: 'Чартов два, и версия у них общая: okoscope ставит сервер и веб-интерфейс, okoscope-agent — агент на узлах. Команды ниже печатают полный список значений по умолчанию для той версии, которую вы собираетесь ставить, а справочник docs/helm-values.md в репозитории перечисляет все параметры вместе с ограничениями. Здесь собрано то, что меняют чаще всего.',
          },
          {
            en: 'One rule holds for both charts: values may carry the names and keys of Secrets that already exist, and never a database URL or an Application credential, because Helm stores everything you pass in the release Secret. Image tags in the sources are placeholders; a published release pins the component images.',
            ru: 'Для обоих чартов действует одно правило: в values можно указывать имена и ключи уже существующих Secrets и никогда — строку подключения к базе или токен приложения, потому что всё переданное Helm сохраняет в Secret релиза. Теги образов в исходниках — заглушки; опубликованный релиз фиксирует образы компонентов.',
          },
        ],
        codeLanguage: 'bash',
        code: `helm show values oci://ghcr.io/ihippik/charts/okoscope --version <OKOSCOPE_VERSION>
helm show values oci://ghcr.io/ihippik/charts/okoscope-agent --version <OKOSCOPE_VERSION>`,
      },
      {
        id: 'values-server',
        headingLevel: 3,
        title: { en: 'okoscope: server and web', ru: 'okoscope: сервер и интерфейс' },
        paragraphs: [
          {
            en: 'The database values are always required. server.corsOrigins can stay empty when the chart manages Web ingress because the chart trusts the Origin derived from ingress.web.host automatically; it becomes an explicit required list when Web/API is exposed through an external ingress, reverse proxy or alternate browser Origin. Every other line carries the chart default and says so in its comment. Copy the file, replace the Secret names, hosts and version, and pass it with -f values.yaml.',
            ru: 'Параметры базы данных обязательны всегда. server.corsOrigins можно оставить пустым, когда Web ingress создаёт чарт: Origin из ingress.web.host будет добавлен в доверенные автоматически. Для внешнего ingress, reverse proxy или альтернативного браузерного Origin нужен явный список. В каждой другой строке указано значение по умолчанию. Скопируйте файл, замените имена Secrets, хосты и версию и передайте его через -f values.yaml.',
          },
        ],
        codeLanguage: 'yaml',
        code: {
          en: `# values.yaml - chart okoscope: server, web interface and migration hook.
# Values marked required have no default. The rest are shown with the chart
# default, so any of those lines can be deleted instead of pinned.
#
# helm upgrade --install okoscope oci://ghcr.io/ihippik/charts/okoscope \\
#   --version <OKOSCOPE_VERSION> --namespace okoscope-system -f values.yaml

database:
  existingSecret: okoscope-database   # required - Secret that already holds the PostgreSQL URL
  urlKey: database-url                # required - key inside it; the chart has no value for the URL

# Internal keys. Left empty, Helm generates them and keeps them across upgrades.
# Name your own Secrets when templates are rendered offline for GitOps,
# where generated values cannot survive.
internalSecret:
  existingSecret: ""                  # default: empty - externally managed internal keys
setupAuthorization:
  existingSecret: ""                  # default: empty - externally managed setup token

server:
  registrationEnabled: false          # default - public signup, off with or without ingress
  sessionLifetimeSeconds: 43200       # default - session lifetime, twelve hours
  corsOrigins: []                     # default: empty - chart trusts the Web ingress Origin
                                      # https with tlsSecret, otherwise http; add exact external Origins
  replicas: 1                         # default - more replicas need a PostgreSQL topology built for it
  image:
    tag: ""                           # default: empty - a published release pins the image
    digest: ""                        # default: empty - digest wins over tag when both are set
  resources: {}                       # default - measure your load before setting limits

web:
  replicas: 1                         # default
  image:
    tag: ""                           # default: empty
  resources: {}                       # default

# Public routing. Both routes are off by default and independent of each other:
# browsers arrive through web, agents through grpc.
ingress:
  web:
    enabled: false                    # default - turn on for browser and API access
    className: ""                     # default: empty - the cluster default; or nginx, traefik
    host: ""                          # required when enabled, e.g. okoscope.example.com
    tlsSecret: ""                     # required when enabled, unless cert-manager creates it
  grpc:
    enabled: false                    # default - turn on for agents outside the cluster
    className: ""                     # default: empty
    host: ""                          # required when enabled, e.g. agents.okoscope.example.com
    tlsSecret: ""                     # required when enabled

certManager:
  enabled: false                      # default - on: cert-manager issues the TLS Secrets above
  clusterIssuer: ""                   # required when certManager is enabled

podDisruptionBudget:
  enabled: true                       # default - blocks voluntary eviction while you run one replica
  minAvailable: 1                     # default

migration:
  backoffLimit: 2                     # default - retries of the migration hook
  activeDeadlineSeconds: 300          # default - and its deadline

# Delivery worker for notifications. Saving a destination does not start it.
notifications:
  enabled: false                      # default
  pollMilliseconds: 1000              # default
  claimSize: 50                       # default
  concurrency: 8                      # default
  leaseSeconds: 30                    # default
  drainSeconds: 15                    # default

# What the Connect agent wizard offers. It installs no agent by itself, and an
# empty publicGrpcEndpoint omits this metadata entirely.
agentInstallation:
  publicGrpcEndpoint: ""              # default: empty, e.g. https://agents.okoscope.example.com:443
  chartReference: oci://ghcr.io/ihippik/charts/okoscope-agent  # required with an endpoint
  chartVersion: <OKOSCOPE_VERSION>          # required with an endpoint
  recommendedAgentVersion: <OKOSCOPE_VERSION>  # required with an endpoint
  minimumAgentVersion: <OKOSCOPE_VERSION>   # required with an endpoint
  tlsMode: system                     # default - or custom_ca with the CA Secret below
  caSecret:
    name: ""                          # required when tlsMode is custom_ca
    key: ""                           # required when tlsMode is custom_ca

imagePullSecrets: []                  # default - existing private-registry credentials

okoscope-agent:
  enabled: false                      # default - on: install the agent chart as a dependency;
                                      # its settings nest here and inherit nothing from the parent`,
          ru: `# values.yaml - чарт okoscope: сервер, веб-интерфейс и hook миграций.
# У значений с пометкой «обязательно» умолчания нет. Остальные показаны со
# значением по умолчанию, поэтому любую такую строку можно просто удалить.
#
# helm upgrade --install okoscope oci://ghcr.io/ihippik/charts/okoscope \\
#   --version <OKOSCOPE_VERSION> --namespace okoscope-system -f values.yaml

database:
  existingSecret: okoscope-database   # обязательно - уже созданный Secret со строкой подключения
  urlKey: database-url                # обязательно - ключ в нём; параметра для самого URL нет

# Внутренние ключи. Если оставить пустыми, Helm сгенерирует их и сохранит при обновлениях.
# Указывайте свои Secrets, когда шаблоны рендерятся офлайн для GitOps:
# там сгенерированные значения не выживают.
internalSecret:
  existingSecret: ""                  # по умолчанию пусто - внешние внутренние ключи
setupAuthorization:
  existingSecret: ""                  # по умолчанию пусто - внешний setup-токен

server:
  registrationEnabled: false          # по умолчанию - открытая регистрация, выключена при любом ingress
  sessionLifetimeSeconds: 43200       # по умолчанию - время жизни сессии, двенадцать часов
  corsOrigins: []                     # по умолчанию пусто - чарт доверяет Origin Web ingress
                                      # https с tlsSecret, иначе http; добавьте точные внешние Origins
  replicas: 1                         # по умолчанию - больше реплик требует подходящей топологии PostgreSQL
  image:
    tag: ""                           # по умолчанию пусто - опубликованный релиз фиксирует образ
    digest: ""                        # по умолчанию пусто - при обоих заданных digest важнее tag
  resources: {}                       # по умолчанию - измерьте нагрузку, прежде чем ставить лимиты

web:
  replicas: 1                         # по умолчанию
  image:
    tag: ""                           # по умолчанию пусто
  resources: {}                       # по умолчанию

# Публичная маршрутизация. Оба маршрута выключены по умолчанию и независимы:
# браузеры приходят через web, агенты - через grpc.
ingress:
  web:
    enabled: false                    # по умолчанию - включите для доступа к интерфейсу и API
    className: ""                     # по умолчанию пусто - класс кластера; либо nginx, traefik
    host: ""                          # обязательно при включении, например okoscope.example.com
    tlsSecret: ""                     # обязательно при включении, если его не создаёт cert-manager
  grpc:
    enabled: false                    # по умолчанию - включите для агентов вне кластера
    className: ""                     # по умолчанию пусто
    host: ""                          # обязательно при включении, например agents.okoscope.example.com
    tlsSecret: ""                     # обязательно при включении

certManager:
  enabled: false                      # по умолчанию - при включении cert-manager выпустит TLS Secrets выше
  clusterIssuer: ""                   # обязательно, если certManager включён

podDisruptionBudget:
  enabled: true                       # по умолчанию - запрещает вытеснение, пока реплика одна
  minAvailable: 1                     # по умолчанию

migration:
  backoffLimit: 2                     # по умолчанию - повторы hook миграций
  activeDeadlineSeconds: 300          # по умолчанию - и его предельное время

# Обработчик доставки уведомлений. Сохранение получателя его не запускает.
notifications:
  enabled: false                      # по умолчанию
  pollMilliseconds: 1000              # по умолчанию
  claimSize: 50                       # по умолчанию
  concurrency: 8                      # по умолчанию
  leaseSeconds: 30                    # по умолчанию
  drainSeconds: 15                    # по умолчанию

# Что предлагает мастер подключения агента. Сам агент этим не устанавливается,
# а при пустом publicGrpcEndpoint метаданные не передаются вовсе.
agentInstallation:
  publicGrpcEndpoint: ""              # по умолчанию пусто, например https://agents.okoscope.example.com:443
  chartReference: oci://ghcr.io/ihippik/charts/okoscope-agent  # обязательно, если задан endpoint
  chartVersion: <OKOSCOPE_VERSION>          # обязательно, если задан endpoint
  recommendedAgentVersion: <OKOSCOPE_VERSION>  # обязательно, если задан endpoint
  minimumAgentVersion: <OKOSCOPE_VERSION>   # обязательно, если задан endpoint
  tlsMode: system                     # по умолчанию - либо custom_ca с CA Secret ниже
  caSecret:
    name: ""                          # обязательно при tlsMode: custom_ca
    key: ""                           # обязательно при tlsMode: custom_ca

imagePullSecrets: []                  # по умолчанию - существующие credentials private registry

okoscope-agent:
  enabled: false                      # по умолчанию - при включении чарт агента ставится зависимостью;
                                      # его настройки живут здесь и ничего не наследуют от родителя`,
        },
      },
      {
        id: 'values-agent',
        headingLevel: 3,
        title: { en: 'okoscope-agent: the node agent', ru: 'okoscope-agent: агент на узлах' },
        paragraphs: [
          {
            en: 'Three things are required: where to send the data, the cluster name passed to the agent, and which workloads to watch. The Kubernetes UID remains the authoritative cluster identity. The observation defaults are deliberately modest, so widen them only once the basics work.',
            ru: 'Обязательны три вещи: куда отправлять данные, какое название кластера передать агенту и за какими нагрузками наблюдать. Авторитетным идентификатором кластера остаётся Kubernetes UID. Значения наблюдения по умолчанию намеренно скромные: расширяйте их, когда базовый сценарий уже заработал.',
          },
        ],
        codeLanguage: 'yaml',
        code: {
          en: `# values.yaml - chart okoscope-agent: the DaemonSet with the eBPF agent.
# Values marked required have no default. The rest are shown with the chart default.
#
# helm upgrade --install okoscope-agent oci://ghcr.io/ihippik/charts/okoscope-agent \\
#   --version <OKOSCOPE_VERSION> --namespace okoscope-system -f values.yaml

server:
  endpoint: https://agents.example.com:443  # required - TLS gRPC address, https:// included
  developmentPlaintext: false         # default - true turns TLS off, isolated development only
  caSecret:
    name: ""                          # required for a private CA; only the reference travels through values
    key: ""                           # required for a private CA - the key holding the certificate

identity:
  clusterName: production             # required - saved installation name passed to the agent

# One entry per Application, 1 to 32 of them. Each entry selects exactly one
# Deployment, by name or by a bounded labels map, never by both.
workloads:
  - namespace: production             # required
    kind: Deployment                  # required - the only supported kind
    name: payment-api                 # required unless you select by labels instead
    credentialSecret:
      name: okoscope-application-credentials  # required - existing Secret in the agent namespace
      key: payment-api                        # required - the key holding that Application token

observation:
  processExec: true                   # default - which executables ran
  processExit: true                   # default - and how they ended
  syscalls: []                        # default: empty allowlist - nothing until you name calls, e.g. [ptrace, setns]
  network:
    connect: true                     # default - outbound attempts
    listen: true                      # default - TCP listening endpoints
    accept: true                      # default - accepted inbound activity
    maxAcceptedEventsPerSecond: 25    # default - the rate bound for accept
    dns:
      enabled: false                  # default - once on, udp and tcp are both enabled
  files:
    enabled: false                    # default - experimental
    operations: [create, modify, delete, rename]  # required when files are enabled
    includePaths: [/app/data]         # required when files are enabled - absolute paths only
    excludePaths: [/app/data/private] # optional - exclusions take precedence over inclusions

safety:
  queueCapacity: 4096                 # default - the bounds on collection
  batchSize: 256                      # default
  maxEventsPerSecond: 1000            # default
  maxApplicationStreams: 32           # default

image:
  tag: ""                             # default: empty - a published release pins the image
imagePullSecrets: []                  # default
resources: {}                         # default
nodeSelector: {}                      # default
tolerations: []                       # default
affinity: {}                          # default
podAnnotations: {}                    # default`,
          ru: `# values.yaml - чарт okoscope-agent: DaemonSet с агентом eBPF.
# У значений с пометкой «обязательно» умолчания нет. Остальные показаны со значением по умолчанию.
#
# helm upgrade --install okoscope-agent oci://ghcr.io/ihippik/charts/okoscope-agent \\
#   --version <OKOSCOPE_VERSION> --namespace okoscope-system -f values.yaml

server:
  endpoint: https://agents.example.com:443  # обязательно - TLS gRPC-адрес вместе с https://
  developmentPlaintext: false         # по умолчанию - true отключает TLS, только для изолированной разработки
  caSecret:
    name: ""                          # обязательно для частного CA; через values идёт только ссылка
    key: ""                           # обязательно для частного CA - ключ с сертификатом

identity:
  clusterName: production             # обязательно - сохранённое имя, передаваемое агенту

# По одному элементу на приложение, от 1 до 32. Каждый выбирает ровно один
# Deployment - по имени либо по ограниченному набору labels, но не по обоим сразу.
workloads:
  - namespace: production             # обязательно
    kind: Deployment                  # обязательно - единственный поддерживаемый kind
    name: payment-api                 # обязательно, если не выбираете по labels
    credentialSecret:
      name: okoscope-application-credentials  # обязательно - существующий Secret в namespace агента
      key: payment-api                        # обязательно - ключ с токеном этого приложения

observation:
  processExec: true                   # по умолчанию - какие исполняемые файлы запускались
  processExit: true                   # по умолчанию - и как они завершились
  syscalls: []                        # по умолчанию пустой allowlist - пока не перечислите, например [ptrace, setns]
  network:
    connect: true                     # по умолчанию - исходящие попытки
    listen: true                      # по умолчанию - слушающие точки TCP
    accept: true                      # по умолчанию - принятая входящая активность
    maxAcceptedEventsPerSecond: 25    # по умолчанию - ограничение скорости для accept
    dns:
      enabled: false                  # по умолчанию - при включении работают и udp, и tcp
  files:
    enabled: false                    # по умолчанию - экспериментально
    operations: [create, modify, delete, rename]  # обязательно при включении файлов
    includePaths: [/app/data]         # обязательно при включении - только абсолютные пути
    excludePaths: [/app/data/private] # необязательно - исключения важнее включений

safety:
  queueCapacity: 4096                 # по умолчанию - границы сбора
  batchSize: 256                      # по умолчанию
  maxEventsPerSecond: 1000            # по умолчанию
  maxApplicationStreams: 32           # по умолчанию

image:
  tag: ""                             # по умолчанию пусто - опубликованный релиз фиксирует образ
imagePullSecrets: []                  # по умолчанию
resources: {}                         # по умолчанию
nodeSelector: {}                      # по умолчанию
tolerations: []                       # по умолчанию
affinity: {}                          # по умолчанию
podAnnotations: {}                    # по умолчанию`,
        },
      },
      {
        id: 'values-validation',
        headingLevel: 3,
        title: { en: 'When values are wrong', ru: 'Если values заданы неверно' },
        paragraphs: [
          {
            en: 'Helm checks your file against the chart schema, and the agent checks it again when it starts. A combination that cannot work therefore fails at install time instead of turning into an agent that quietly collects nothing.',
            ru: 'Helm проверяет ваш файл по схеме чарта, а агент — ещё раз при запуске. Поэтому неработоспособная комбинация проявляется при установке, а не превращается в агента, который молча ничего не собирает.',
          },
        ],
      },
      {
        id: 'backups',
        title: {
          en: 'Backups and upgrades',
          ru: 'Резервные копии и обновления',
        },
        paragraphs: [
          {
            en: 'Before every helm upgrade, back up PostgreSQL and test the restore into a separate database — Okoscope neither schedules backups nor checks that yours work. Back up externally managed Secrets and the chart-generated internal keys as well, separately from the database. Then read the release notes of the version you are moving to, confirm migration compatibility, and upgrade to an explicitly pinned chart version.',
            ru: 'Перед каждым helm upgrade делайте резервную копию PostgreSQL и проверяйте восстановление в отдельную базу: Okoscope не запускает резервное копирование и не проверяет, что ваше работает. Отдельно от базы сохраните внешние Secrets и сгенерированные чартом внутренние ключи. Затем прочитайте примечания к версии, на которую переходите, убедитесь в совместимости миграций и обновляйтесь до явно зафиксированной версии чарта.',
          },
          {
            en: 'For a release that already exists, the backend repository offers make deploy-preview VERSION=<chart-version> and make deploy VERSION=<chart-version>. Point KUBE_NAMESPACE and HELM_RELEASE at your installation — they default to okoscope in the aliens context — and add VALUES=production-values.yaml if you keep one. Both commands merge the new chart defaults with the overrides saved in the release and the values you pass, which means an image tag or digest you pinned by hand has to be updated in your own values file. The preview hides Secret manifests, the real upgrade runs the migration hooks, and neither builds images or creates a new installation.',
            ru: 'Для уже существующего релиза в backend-репозитории есть make deploy-preview VERSION=<версия-чарта> и make deploy VERSION=<версия-чарта>. Укажите в KUBE_NAMESPACE и HELM_RELEASE свою установку — по умолчанию это okoscope в контексте aliens — и добавьте VALUES=production-values.yaml, если такой файл у вас есть. Обе команды объединяют новые значения чарта с сохранёнными в релизе переопределениями и переданными values, а значит, закреплённый вручную тег или digest образа нужно обновить в своём values-файле. Предварительная проверка скрывает манифесты Secrets, настоящее обновление запускает хуки миграции, и ни то ни другое не собирает образы и не создаёт новую установку.',
          },
          {
            en: 'helm rollback restores only the stateless resources the chart owns; it does not reverse a database migration. So roll back only when the older version can work with the schema you now have. helm uninstall removes the chart-owned resources and leaves your PostgreSQL database and every pre-existing Secret untouched. Never delete migration records or data to force a rollback through.',
            ru: 'helm rollback восстанавливает только stateless-ресурсы, которыми владеет чарт, и не отменяет миграции базы. Поэтому откатывайтесь лишь тогда, когда старая версия работает с текущей схемой. helm uninstall удаляет ресурсы чарта, но не трогает ни вашу PostgreSQL, ни один из существовавших до установки Secrets. Никогда не удаляйте записи миграций или данные ради принудительного отката.',
          },
        ],
      },
      {
        id: 'connect-agents',
        title: {
          en: 'Connect agents to your server',
          ru: 'Подключите агентов к своему серверу',
        },
        paragraphs: [
          {
            en: 'After deploying the server, open /onboarding on your own web domain. Create or select an Organization, Project and Application. If registration is disabled, ask your installation operator for access. Select the cluster name and Deployment namespace, then its exact name or labels. Run the generated Secret and agent Helm commands in the cluster you want to observe; the credential Secret must be in the agent namespace, even when the workload lives elsewhere.',
            ru: 'После развёртывания сервера откройте /onboarding на собственном домене сайта. Создайте или выберите организацию, проект и приложение. Если регистрация отключена, запросите доступ у оператора вашей установки. Укажите имя кластера и namespace Deployment, затем его точное имя или метки. Выполните сгенерированные команды создания Secret и установки агента через Helm в наблюдаемом кластере; Secret с токеном должен находиться в namespace агента, даже если нагрузка работает в другом.',
          },
          {
            en: 'The wizard must supply your own public gRPC endpoint, for example https://agents.okoscope.example.com:443, and the compatible chart version. Configure agentInstallation.publicGrpcEndpoint, chartReference, chartVersion, recommendedAgentVersion and minimumAgentVersion in your server values. Do not use the Cloud endpoint for credentials issued by your self-hosted server. In the generic example below, replace <grpc-host> with your own gRPC domain and <OKOSCOPE_VERSION> with the version from your wizard; neither placeholder is an environment variable.',
            ru: 'Мастер должен выдавать ваш публичный gRPC endpoint, например https://agents.okoscope.example.com:443, и совместимую версию чарта. Настройте agentInstallation.publicGrpcEndpoint, chartReference, chartVersion, recommendedAgentVersion и minimumAgentVersion в values своего сервера. Не используйте Cloud endpoint с токенами, выданными вашим self-hosted-сервером. В общем примере ниже замените <grpc-host> собственным доменом gRPC, а <OKOSCOPE_VERSION> — версией из своего мастера; оба плейсхолдера не являются переменными окружения.',
          },
          {
            en: 'For publicly trusted TLS certificates, use system trust without a CA Secret. Only if your server uses a private CA, obtain its certificate from the operator and create a CA Secret in the agent namespace using the name and key shown by the wizard. The Helm command references server.caSecret.name and server.caSecret.key; do not put certificates or Application tokens into Helm values. Keep server.developmentPlaintext disabled outside isolated development.',
            ru: 'Для публично доверенных TLS-сертификатов используйте системное доверие без Secret с CA. Только если ваш сервер использует частный CA, получите сертификат у оператора и создайте Secret с CA в namespace агента с именем и ключом из мастера. Helm-команда ссылается на server.caSecret.name и server.caSecret.key; не помещайте сертификаты или токены приложений в Helm values. Оставляйте server.developmentPlaintext выключенным за пределами изолированной разработки.',
          },
          {
            en: 'After installation, check the agent DaemonSet rollout and logs, generate normal activity in the selected Deployment, and confirm a connected stream and an event attributed to the Application. A running Pod alone does not confirm delivery. See Troubleshooting if observations do not appear.',
            ru: 'После установки проверьте rollout DaemonSet и логи агента, создайте обычную активность в выбранном Deployment и убедитесь, что есть подключённый поток и событие, привязанное к приложению. Сам по себе работающий Pod не подтверждает доставку. Если наблюдения не появляются, откройте раздел устранения проблем.',
          },
        ],
        codeLanguage: 'bash',
        code: `helm upgrade --install okoscope-agent \\
  oci://ghcr.io/ihippik/charts/okoscope-agent \\
  --version <OKOSCOPE_VERSION> \\
  --namespace okoscope-system \\
  --set server.endpoint=https://<grpc-host>:443 \\
  --set identity.clusterName=production \\
  --set 'workloads[0].namespace=production' \\
  --set 'workloads[0].kind=Deployment' \\
  --set 'workloads[0].name=payment-api' \\
  --set 'workloads[0].credentialSecret.name=okoscope-application-credentials' \\
  --set 'workloads[0].credentialSecret.key=payment-api'`,
      },
      {
        id: 'production-values',
        title: {
          en: 'Production routing and external secrets',
          ru: 'Production-маршрутизация и внешние Secrets',
        },
        paragraphs: [
          {
            en: 'The two ingresses are independent: browsers reach Web and the API through one, agents reach gRPC through the other, and each route needs its own ingress class, host and TLS Secret. The chart supports gRPC routing for both ingress-nginx and Traefik, and controller-specific annotations go under the matching route. If you would rather cert-manager issued those TLS Secrets, enable certManager and give it an existing ClusterIssuer; otherwise the Secrets have to exist before you install.',
            ru: 'Два ingress независимы: через один браузеры попадают в интерфейс и API, через другой агенты приходят по gRPC, и каждому маршруту нужны свои ingress class, host и TLS Secret. gRPC-маршрутизацию чарт поддерживает и для ingress-nginx, и для Traefik, а специфичные для контроллера аннотации задаются в соответствующем маршруте. Если TLS Secrets должен выпускать cert-manager, включите certManager и укажите существующий ClusterIssuer; иначе эти Secrets нужно создать до установки.',
          },
          {
            en: 'When External Secrets or a similar controller manages your keys, point internalSecret.existingSecret at the Secret it maintains; that Secret has to carry the keys named by adminCredentialKey, webhookEncryptionKey and identityTokenKey. Private registry credentials go in imagePullSecrets. And if you scale the server beyond one replica, remember that the database has to be ready for it too: the chart never makes PostgreSQL highly available, so that part is a topology you size and operate yourself.',
            ru: 'Если ключами управляет External Secrets или похожий контроллер, укажите в internalSecret.existingSecret тот Secret, который он поддерживает; в этом Secret должны быть ключи, названные в adminCredentialKey, webhookEncryptionKey и identityTokenKey. Учётные данные private registry задаются в imagePullSecrets. А если увеличиваете число реплик сервера, помните, что к этому должна быть готова и база: высокодоступной PostgreSQL чарт не делает никогда, так что эту топологию вы рассчитываете и обслуживаете сами.',
          },
        ],
        codeLanguage: 'yaml',
        code: `ingress:
  web:
    enabled: true
    className: nginx
    host: okoscope.example.com
    tlsSecret: okoscope-web-tls
  grpc:
    enabled: true
    className: nginx
    host: agents.okoscope.example.com
    tlsSecret: okoscope-grpc-tls
internalSecret:
  existingSecret: okoscope-internal
imagePullSecrets:
  - name: registry-credentials`,
      },
    ],
    related: ['quick-start', 'data-and-security', 'troubleshooting'],
  },
  {
    slug: 'capabilities',
    title: {
      en: 'Capabilities',
      ru: 'Возможности',
    },
    intro: {
      en: 'What each kind of observation tells you, and when it is worth turning on.',
      ru: 'Что даёт каждый вид наблюдений и когда его стоит включать.',
    },
    sections: [
      {
        id: 'processes',
        icon: 'processes',
        title: {
          en: 'Processes, system calls and termination',
          ru: 'Процессы, системные вызовы и завершения',
        },
        paragraphs: [
          {
            en: 'Process execution tells you which executables ran inside the workloads you selected. Turn on processExit if you also want to see processes ending, and list the system calls you care about explicitly, ptrace and setns for example. This is a profile you configure, not a recording of every system call the kernel handled.',
            ru: 'Наблюдение запусков показывает, какие исполняемые файлы работали внутри выбранных нагрузок. Если нужны и завершения, включите processExit, а системные вызовы перечислите явно — например, ptrace и setns. Это профиль, который вы настраиваете сами, а не запись всех системных вызовов подряд.',
          },
          {
            en: 'The termination and restart views put kernel evidence and Kubernetes evidence side by side: the process, the container it belonged to, the exit code or signal, the reported reason and any related observations. Read them together. A SIGKILL on its own does not mean the process was killed for memory — that conclusion needs evidence that says so. And a container restarting is a different event from a child process exiting.',
            ru: 'Представления завершений и перезапусков показывают рядом данные ядра и Kubernetes: процесс, контейнер, к которому он относился, код выхода или сигнал, указанную причину и связанные наблюдения. Смотрите на них вместе. Сам по себе SIGKILL не означает, что процесс убили из-за памяти: для такого вывода нужны прямые подтверждения. И перезапуск контейнера — это не то же самое, что завершение дочернего процесса.',
          },
        ],
      },
      {
        id: 'network',
        icon: 'network',
        title: {
          en: 'Outbound, inbound and DNS',
          ru: 'Исходящая сеть, входящая сеть и DNS',
        },
        paragraphs: [
          {
            en: 'Outbound connect observations give you the destination address and port, the address family and how the syscall ended. They say nothing about the transport, so do not read TCP or UDP into them, and an attempt is not proof that a connection was established. Listen and accept observations are optional and describe the other direction: TCP listening endpoints and inbound activity that was accepted. Check which direction an observation describes before you compare it with another one.',
            ru: 'Исходящие наблюдения connect дают адрес и порт назначения, семейство адресов и результат системного вызова. О транспорте они ничего не говорят, поэтому не вычитывайте из них TCP или UDP, а сама попытка ещё не означает установленного соединения. Наблюдения listen и accept включаются отдельно и описывают другое направление: слушающие точки TCP и принятую входящую активность. Прежде чем сравнивать наблюдения между собой, посмотрите, какое направление описывает каждое.',
          },
          {
            en: 'DNS is off by default. Switch it on and you get bounded observations of plaintext UDP and TCP traffic on port 53: names, A and AAAA addresses, CNAME relationships, the response code and the TTL. A recent matching answer can annotate a connection with a name, which is convenient, but one shared IP can belong to several names, and correlation is not causation. Encrypted DNS stays encrypted, and Okoscope never fills a gap with a reverse lookup.',
            ru: 'DNS по умолчанию выключен. Если включить, вы получите ограниченные наблюдения открытого трафика UDP и TCP на порту 53: имена, адреса A и AAAA, связи CNAME, код ответа и TTL. Недавний совпавший ответ может подписать соединение именем — это удобно, но за одним общим IP может стоять несколько имён, а совпадение по времени не доказывает причинной связи. Зашифрованный DNS остаётся зашифрованным, а имя по обратному запросу Okoscope не подставляет.',
          },
        ],
      },
      {
        id: 'files',
        icon: 'files',
        title: {
          en: 'Experimental file activity',
          ru: 'Экспериментальная файловая активность',
        },
        paragraphs: [
          {
            en: 'File observation is opt-in, and you have to say what you want: which operations, and at least one normalized absolute prefix to include. Exclusions always win over inclusions. The syscall-path profile reports the successful operations it supports, using the paths the process passed in and the descriptor mappings it kept. It does not read file contents and does not resolve a canonical inode identity.',
            ru: 'Наблюдение файлов включается отдельно, и настроить его придётся самостоятельно: выбрать операции и задать хотя бы один нормализованный абсолютный префикс включения. Исключения всегда важнее включений. Профиль syscall-path сообщает об успешных поддерживаемых операциях, опираясь на пути, которые передал сам процесс, и на сохранённые соответствия дескрипторов. Содержимое файлов он не читает и каноническую идентичность inode не определяет.',
          },
          {
            en: 'Relative paths, symbolic-link aliases and memory-mapped writes fall outside what this profile promises to see. Modifications are aggregated over a fixed five-second window, so rapid writes collapse into one observation. A successful open with O_CREAT does not prove a file was created; only O_CREAT together with O_EXCL does. Start with one narrow path that holds nothing sensitive.',
            ru: 'Относительные пути, псевдонимы символических ссылок и записи через mmap этот профиль полнотой не покрывает. Изменения объединяются в фиксированном окне в пять секунд, поэтому частые записи схлопываются в одно наблюдение. Успешный open с O_CREAT ещё не доказывает, что файл создан: доказывает только сочетание O_CREAT и O_EXCL. Начните с одного узкого пути, где нет чувствительных данных.',
          },
        ],
        codeLanguage: 'yaml',
        code: 'observation:\n  files:\n    enabled: true\n    operations: [create, modify, delete, rename]\n    includePaths: [/app/data]\n    excludePaths: [/app/data/private]',
      },
      {
        id: 'review',
        icon: 'review',
        title: {
          en: 'Inventory, releases, policies and notifications',
          ru: 'Инвентаризация, релизы, политики и уведомления',
        },
        paragraphs: [
          {
            en: 'Inventory is where you browse what was seen — executables, network identities, file paths — together with the evidence still stored for each. Release comparison puts a baseline next to a target and shows how their behavior differs; where coverage has expired, the answer is unknown rather than no. So look at coverage first, then decide what a missing behavior means.',
            ru: 'Инвентаризация — это место, где можно просмотреть увиденное: исполняемые файлы, сетевые объекты, пути — вместе с сохранившимися подтверждениями. Сравнение релизов ставит базовую версию рядом с целевой и показывает, чем отличается их поведение; там, где история истекла, ответом будет «неизвестно», а не «не было». Поэтому сначала смотрите на покрытие и только потом решайте, что означает отсутствующее поведение.',
          },
          {
            en: 'Runtime policies record how you decided to treat a behavior when you reviewed it. They are a review tool: they do not install a kernel firewall and they do not block a syscall. Project notifications forward supported findings to the destinations you configured. Delivery is tracked separately from the finding itself, so check the delivery record and its attempts — an event in the interface does not mean a webhook arrived.',
            ru: 'Политики фиксируют, как вы решили относиться к поведению при разборе. Это инструмент анализа: они не ставят межсетевой экран в ядре и не блокируют системные вызовы. Уведомления проекта пересылают поддерживаемые находки настроенным получателям. Доставка учитывается отдельно от самой находки, поэтому смотрите запись доставки и её попытки: событие в интерфейсе ещё не значит, что webhook дошёл.',
          },
        ],
      },
    ],
    related: ['workflows', 'compatibility-and-limits', 'data-and-security'],
  },
  {
    slug: 'workflows',
    title: {
      en: 'Practical workflows',
      ru: 'Практические сценарии',
    },
    intro: {
      en: 'How to get from a question to the evidence that answers it, and then to a decision.',
      ru: 'Как пройти путь от вопроса к данным, которые на него отвечают, и затем к решению.',
    },
    sections: [
      {
        id: 'new-connection',
        title: {
          en: 'Investigate a new connection',
          ru: 'Исследуйте новое соединение',
        },
        paragraphs: [
          {
            en: 'Open the Application’s runtime groups and pick a recent observation window. Find the outbound network behavior, look at the destination IP and port and at the process and workload it came from, then open the event evidence that is still available. If there is DNS context, check its confidence, its TTL and whether it is ambiguous. An event with only an IP is perfectly good evidence: you do not need to guess a domain to carry on.',
            ru: 'Откройте группы событий приложения и выберите недавний интервал. Найдите исходящую сетевую активность, посмотрите на IP и порт назначения, на процесс и нагрузку, из которых она пришла, и откройте сохранившиеся подробности события. Если есть DNS-контекст, проверьте уверенность, TTL и нет ли неоднозначности. Событие с одним только IP — вполне полноценное свидетельство: домен угадывать не нужно.',
          },
          {
            en: 'Compare the destination with the dependencies you expect and with what the previous release did. Once you have made up your mind, record the decision as a policy, and confirm it landed by seeing the intended effective policy on the group. Remember what that actually does: it classifies the behavior for review, it does not stop the next connection.',
            ru: 'Сравните адрес назначения с ожидаемыми зависимостями и с тем, что делал предыдущий релиз. Когда решение принято, зафиксируйте его политикой и убедитесь, что группа показывает нужную действующую политику. Помните, что при этом происходит: поведение размечается для разбора, но следующее соединение не блокируется.',
          },
        ],
      },
      {
        id: 'policies',
        headingLevel: 3,
        title: {
          en: 'Work with Policies',
          ru: 'Работа с политиками',
        },
        paragraphs: [
          {
            en: 'Policies mark observed Application behavior as expected or as something that needs review. They do not block processes or connections, they do not change the lifecycle of findings, and they never delete evidence. To create one you have to be signed in with access to the Application, and you have to start from a retained Runtime Group or inventory observation that can seed a policy.',
            ru: 'Политики помечают наблюдаемое поведение приложения как ожидаемое или как требующее проверки. Они не блокируют процессы и соединения, не меняют жизненный цикл находок и никогда не удаляют данные. Чтобы создать политику, нужно войти в систему, иметь доступ к приложению и начать с сохранённой группы событий или записи инвентаризации, из которой политику можно построить.',
          },
          {
            en: 'Open the Runtime Group or the inventory observation and choose Create policy from observation. Give it a name, check the placement scope shown in the dialog, and select Preview impact — the preview is required before anything is created. It tells you how many groups and sightings would be affected, and how many of them would come out expected or requiring review. If the observation cannot seed a policy at all, the dialog says so instead of creating one.',
            ru: 'Откройте группу событий или запись инвентаризации и выберите «Создать политику из наблюдения». Задайте имя, проверьте показанную область действия и нажмите «Предварительный просмотр влияния» — без просмотра политика не создаётся. Он показывает, сколько групп и наблюдений будет затронуто и сколько из них окажутся ожидаемыми, а сколько потребуют проверки. Если из наблюдения политику построить нельзя, диалог сообщит об этом вместо создания.',
          },
          {
            en: 'After creating it, open Managed policies from the Application. There you see the current revision, what it affects inside and outside its scope, and the revision history; Enable and Disable switch it on and off. The current interface has no edit action for an existing policy revision. While results are being recomputed, observations show Evaluating policy; when that finishes, check the effective verdict in Runtime Groups or Inventory, and use the verdict and evaluation filters to find the behavior it touched.',
            ru: 'После создания откройте в приложении «Управляемые политики». Там видны текущая ревизия, её эффекты внутри и вне области действия и история ревизий; кнопки «Включить» и «Отключить» управляют активностью. Редактировать существующую ревизию текущий интерфейс не позволяет. Пока результаты пересчитываются, наблюдения показывают «Вычисление политики»; когда пересчёт закончится, проверьте действующий вердикт в группах событий или инвентаризации, а найти затронутое поведение помогут фильтры по вердикту и вычислению.',
          },
        ],
      },
      {
        id: 'release',
        title: {
          en: 'Compare releases',
          ru: 'Сравните релизы',
        },
        paragraphs: [
          {
            en: 'In the Application’s Releases view, choose a baseline and a target and open the runtime comparison. Check the image identities and the observation windows first — that is what makes everything after it meaningful. Then go through the behavior that appeared, disappeared or changed, with its counts and timestamps. Different traffic, or a startup path that one window covered and the other did not, explains a lot of differences that are not defects at all.',
            ru: 'В разделе релизов приложения выберите базовую и целевую версии и откройте сравнение поведения. Сначала проверьте идентичности образов и интервалы наблюдения — именно они придают смысл всему остальному. Затем разберите поведение, которое появилось, исчезло или изменилось, вместе со счётчиками и временем. Разная нагрузка или запуск, попавший в одно окно наблюдения и не попавший в другое, объясняют многие различия, за которыми не стоит никакой ошибки.',
          },
          {
            en: 'Say out loud when coverage is unknown. A numeric history can outlive the details behind it, and expired evidence cannot support a confident claim that something never happened. Finish by opening a representative event that is still stored, or by noting that the details are no longer available.',
            ru: 'Прямо проговаривайте случаи, когда покрытие неизвестно. Числовая история может пережить подробности, на которых она построена, а по истёкшим данным нельзя уверенно утверждать, что чего-то не было. Завершайте разбор так: откройте сохранившийся показательный пример или отметьте, что подробности уже недоступны.',
          },
        ],
      },
      {
        id: 'restarts',
        title: {
          en: 'Explain a restart',
          ru: 'Разберитесь с перезапуском',
        },
        paragraphs: [
          {
            en: 'Start from the finding that needs attention, or from the termination itself, look at the container and workload involved, then line the time up against release changes and whatever exit evidence exists. Keep three things apart: the signal the process received, the termination reason Kubernetes reported, and the restart evidence. Not every exit with signal 9 is an out-of-memory kill.',
            ru: 'Начните с находки, требующей внимания, или с самого завершения, посмотрите на затронутые контейнер и нагрузку, а затем сопоставьте время с изменениями релиза и с тем, что известно о выходе. Разделяйте три вещи: сигнал, который получил процесс, причину завершения по версии Kubernetes и подтверждения перезапуска. Не каждый выход по сигналу 9 — это нехватка памяти.',
          },
          {
            en: 'Use the finding as a pointer, not as an answer: check the workload limits, the application logs and the Kubernetes events with the tools you normally use. If the evidence you need has expired or was never collected, leave the cause open. An unresolved restart is a better outcome than a plausible story nothing supports.',
            ru: 'Считайте находку указателем, а не ответом: проверьте лимиты нагрузки, журналы приложения и события Kubernetes привычными инструментами. Если нужные данные истекли или вообще не собирались, оставьте причину неустановленной. Неразобранный перезапуск лучше правдоподобной истории, которую ничто не подтверждает.',
          },
        ],
      },
      {
        id: 'notifications',
        title: {
          en: 'Configure and verify notifications',
          ru: 'Настройте и проверьте уведомления',
        },
        paragraphs: [
          {
            en: 'In Project notifications, add a destination you are authorized to send to, along with the rules it supports. Look over the destination and the effective settings before you save. Saving alone starts nothing: the operator has to enable the delivery worker. Then trigger a controlled finding that qualifies, and check its delivery record and attempts.',
            ru: 'В уведомлениях проекта добавьте разрешённого получателя и поддерживаемые им правила. Перед сохранением просмотрите получателя и действующие настройки. Само сохранение ничего не запускает: обработчик доставки должен включить оператор. Затем создайте контролируемую подходящую находку и проверьте запись доставки и её попытки.',
          },
          {
            en: 'On the receiving side, verify the timestamped HMAC signature and deduplicate by the delivery ID, which stays stable. Recovery keeps that ID, so a retry can reach a receiver that already processed the payload. Read what a retry or a cancel will do before you confirm it — an active lease can prevent cancellation. The health snapshot is what separates a worker that is disabled from one that is retrying or failing.',
            ru: 'На стороне получателя проверяйте HMAC-подпись с временной меткой и отсеивайте дубликаты по идентификатору доставки — он остаётся стабильным. Восстановление сохраняет этот идентификатор, поэтому повтор может прийти получателю, который уже обработал сообщение. Прежде чем подтверждать повтор или отмену, посмотрите, к чему они приведут: активная аренда может помешать отмене. Отличить отключённый обработчик от повторяющего или сбоящего помогает снимок состояния.',
          },
        ],
      },
    ],
    related: ['capabilities', 'compatibility-and-limits', 'troubleshooting'],
  },
  {
    slug: 'compatibility-and-limits',
    title: {
      en: 'Compatibility and limits',
      ru: 'Совместимость и ограничения',
    },
    intro: {
      en: 'What the agent needs in order to run, and what its evidence can and cannot tell you.',
      ru: 'Что нужно агенту для работы и о чём его данные могут, а о чём не могут говорить.',
    },
    sections: [
      {
        id: 'platform',
        title: {
          en: 'Supported agent platform',
          ru: 'Поддерживаемая платформа агента',
        },
        paragraphs: [
          {
            en: 'The supported baseline is Kubernetes 1.32 or newer, containerd 2.x through CRI, cgroup v2 in unified mode, Linux 6.1 LTS or newer with BTF, and x86_64 nodes. Workload ownership has to run Pod → ReplicaSet → Deployment. The server images being available for ARM64 says nothing about the agent: that is a separate question, and the answer is no.',
            ru: 'Поддерживаемая база: Kubernetes 1.32 или новее, containerd 2.x через CRI, cgroup v2 в единой иерархии, Linux 6.1 LTS или новее с BTF и узлы x86_64. Владение нагрузкой должно идти по цепочке Pod → ReplicaSet → Deployment. То, что серверные образы собираются под ARM64, ничего не говорит об агенте: это отдельный вопрос, и ответ на него отрицательный.',
          },
          {
            en: 'The checks below run on a candidate Linux node, but they cover only part of the requirements: the operator still has to confirm the Kubernetes and runtime versions, the permissions needed to attach probes, and the workload ownership chain. Other runtimes, cgroup v1, unsupported owners and hardened managed-node configurations are not claimed as supported — they may happen to work, but nothing is promised.',
            ru: 'Проверки ниже выполняются на предполагаемом узле Linux, но покрывают лишь часть условий: версии Kubernetes и runtime, права на подключение зондов и цепочку владения нагрузкой оператор проверяет отдельно. Другие runtime, cgroup v1, неподдерживаемые владельцы и ужесточённые конфигурации управляемых узлов как поддерживаемые не заявлены: они могут заработать, но обещаний тут нет.',
          },
        ],
        codeLanguage: 'bash',
        code: 'test -e /sys/kernel/btf/vmlinux\ntest "$(stat -fc %T /sys/fs/cgroup)" = cgroup2fs\nuname -m',
      },
      {
        id: 'profiles',
        title: {
          en: 'Enablement and resource bounds',
          ru: 'Включение функций и ограничения ресурсов',
        },
        paragraphs: [
          {
            en: 'Configuration controls every observation profile. processExec is set explicitly; processExit is false whenever you leave it out. In the parser, network connect, listen and accept as well as DNS all default to disabled — but the reference deployment turns several network probes on, so a sample is not the same thing as a default. File observation is off and experimental. When in doubt, read the ConfigMap that is actually running.',
            ru: 'Каждым профилем наблюдения управляет конфигурация. processExec задаётся явно; processExit при отсутствии равен false. В парсере сетевые connect, listen и accept, а также DNS по умолчанию отключены — но эталонное развёртывание включает несколько сетевых зондов, так что пример и значение по умолчанию — не одно и то же. Файловое наблюдение выключено и экспериментально. Если сомневаетесь, посмотрите тот ConfigMap, который работает у вас.',
          },
          {
            en: 'Collection is bounded from several sides at once: queue capacity, batch size, events per second, and how many Application streams a single agent keeps. DNS adds its own limits on transactions, reassembly and captured bytes, and inbound accept has a separate rate bound. If a required probe cannot attach, the agent stays unready instead of pretending otherwise. Watch the loss and capacity counters and measure your own workload — there is no universal number for overhead and no promise of completeness.',
            ru: 'Сбор ограничен сразу с нескольких сторон: ёмкостью очереди, размером пакета, числом событий в секунду и количеством потоков приложений на одного агента. У DNS есть свои пределы на транзакции, сборку потоков и захваченные байты, а у входящего accept — отдельное ограничение скорости. Если обязательный зонд не удаётся подключить, агент честно остаётся неготовым. Следите за счётчиками потерь и заполнения и измеряйте собственную нагрузку: универсальной цифры накладных расходов нет, как нет и гарантии полноты.',
          },
        ],
      },
      {
        id: 'evidence',
        title: {
          en: 'Evidence boundaries',
          ru: 'Границы выводов',
        },
        paragraphs: [
          {
            en: 'A connect attempt does not always end in a connection. DNS correlation is a recent observation that happens to fit, not proof of cause; encrypted, cached or simply unmatched DNS leaves an IP without a name. File paths describe the arguments that supported calls passed in, not every change the filesystem saw. And a SIGKILL on its own does not prove an out-of-memory kill.',
            ru: 'Попытка connect не всегда заканчивается соединением. Совпадение с DNS — это подходящее по времени наблюдение, а не доказательство причины; зашифрованный, закэшированный или просто не совпавший DNS оставляет IP без имени. Файловые пути описывают аргументы поддерживаемых вызовов, а не каждое изменение в файловой системе. А один SIGKILL не доказывает, что процесс убили из-за памяти.',
          },
          {
            en: 'Filtering, gaps in attribution, queue and ring-buffer loss, rate limits, time windows and retention all remove evidence along the way. That is why an absence of findings cannot certify that nothing happened or that a workload is secure. Comparisons and inventory tell you what coverage they rest on, and a numeric summary can never bring back the Pod or container detail behind it.',
            ru: 'Фильтры, пробелы в привязке, потери в очереди и кольцевом буфере, ограничения скорости, границы интервалов и сроки хранения — всё это по дороге убирает данные. Поэтому отсутствие находок не удостоверяет ни того, что ничего не происходило, ни того, что нагрузка безопасна. Сравнения и инвентаризация сообщают, на какое покрытие они опираются, а числовая сводка никогда не вернёт стоящие за ней подробности о Pod и контейнере.',
          },
        ],
      },
    ],
    related: ['quick-start', 'capabilities', 'data-and-security'],
  },
  {
    slug: 'data-and-security',
    title: {
      en: 'Data and security',
      ru: 'Данные и безопасность',
    },
    intro: {
      en: 'What leaves the node, who can see it, and what disappears over time.',
      ru: 'Что уходит с узла, кто это видит и что со временем удаляется.',
    },
    sections: [
      {
        id: 'collection',
        title: {
          en: 'Collected and excluded data',
          ru: 'Собираемые и исключённые данные',
        },
        paragraphs: [
          {
            en: 'Depending on which profiles are enabled, an observation can carry workload and process identity, executable names, syscall identities, network addresses and ports, DNS names with bounded answers, file path metadata, timestamps and termination evidence. None of that includes payloads, and yet names, paths and addresses can still say a great deal about your business. That is the reason to keep selectors and path prefixes narrow.',
            ru: 'В зависимости от включённых профилей наблюдение может нести идентичности нагрузки и процесса, имена исполняемых файлов, системные вызовы, сетевые адреса и порты, DNS-имена с ограниченными ответами, метаданные путей, время и сведения о завершении. Содержимого там нет, и всё же имена, пути и адреса сами по себе могут многое рассказать о вашем бизнесе. Именно поэтому держите селекторы и префиксы путей узкими.',
          },
          {
            en: 'File contents, write buffers, environment variables and unrestricted command arguments are not collected. DNS observation exports no raw packets and decrypts nothing. This is neither packet capture nor a filesystem backup. Access to the web interface and the API is scoped to your organization, and this public documentation contains no observations from it.',
            ru: 'Содержимое файлов, буферы записи, переменные окружения и произвольные аргументы команд не собираются. Наблюдение DNS не выгружает сырые пакеты и ничего не расшифровывает. Это ни захват трафика, ни резервная копия файловой системы. Доступ к сайту и API ограничен вашей организацией, а в этой публичной документации её наблюдений нет.',
          },
        ],
      },
      {
        id: 'permissions',
        title: {
          en: 'Agent permissions and credentials',
          ru: 'Права агента и токены',
        },
        paragraphs: [
          {
            en: 'The reference agent runs with hostPID, read-only host mounts of /proc and cgroup, and a writable tracefs so it can attach probes at all. It runs as root with an explicit set of capabilities — BPF, NET_ADMIN, PERFMON, SYS_ADMIN and SYS_RESOURCE — rather than in blanket privileged mode. Its Kubernetes RBAC reads Pods, ReplicaSets, Deployments and the kube-system namespace identity; it cannot change workloads or read Secrets through the API. These are node-level privileges, so go through them with your operator before anything is installed.',
            ru: 'Эталонный агент работает с hostPID, смонтированными только для чтения /proc и cgroup узла и доступным для записи tracefs — иначе он вообще не подключит зонды. Он запускается от root с явным набором возможностей: BPF, NET_ADMIN, PERFMON, SYS_ADMIN и SYS_RESOURCE, а не в общем privileged-режиме. Его RBAC читает Pod, ReplicaSet, Deployment и идентичность пространства имён kube-system; менять нагрузки и читать Secret через API он не может. Это права на уровне узла, поэтому разберите их с оператором до установки.',
          },
          {
            en: 'People sign in with individual sessions. Agents use separate versioned Application tokens, and the server stores only their digests. Rotation goes like this: issue an additional credential, update the mounted Secret, roll out the DaemonSet, confirm the new credential shows a recent last-used value, and only then revoke the old one. There is no hot reload. Revoking a token stops that one stream and leaves other Applications alone.',
            ru: 'Люди входят под индивидуальными сессиями. Агенты используют отдельные версионированные токены приложений, и сервер хранит только их дайджесты. Ротация выглядит так: выпустите дополнительный токен, обновите смонтированный Secret, выполните rollout DaemonSet, убедитесь, что у нового токена появилось свежее время последнего использования, и только после этого отзовите старый. Горячей перезагрузки нет. Отзыв останавливает поток этого токена и не задевает другие приложения.',
          },
        ],
      },
      {
        id: 'runtime-retention',
        title: {
          en: 'Runtime details and numerical history',
          ru: 'Подробности событий и числовая история',
        },
        paragraphs: [
          {
            en: 'Retention for runtime evidence is set by organization owners; a Project either inherits the whole policy or overrides it, and members can read the effective values. A fresh installation has cleanup disabled, with 30 days of details and 365 days of total history. raw_days is how long details are kept; history_days is the total age an observation may reach, not an extra period on top of it. Setting history to forever keeps the numbers forever, not the raw details.',
            ru: 'Сроки хранения событий задают владельцы организации; проект либо наследует политику целиком, либо переопределяет её, а участники видят действующие значения. В новой установке очистка выключена, а сроки заданы так: 30 дней подробностей и 365 дней общей истории. raw_days — это срок жизни подробностей, а history_days — предельный возраст наблюдения, а не дополнительный период сверху. Бессрочная история означает вечные числа, а не вечные подробности.',
          },
          {
            en: 'Cleanup runs on its own, in bounded batches, over whole UTC days. What survives is a summary: counts and first and last times per group, release and day — not event payloads and not Pod-level detail. Enabling cleanup, shortening a window or going back to an enabled inherited policy can delete evidence you still have. It does not work in reverse: longer retention or disabled cleanup will not bring deleted details back or reopen closed history.',
            ru: 'Очистка идёт сама, ограниченными пакетами и по полным дням UTC. Остаётся сводка: счётчики и время первого и последнего наблюдения по группе, релизу и дню — но не содержимое событий и не подробности уровня Pod. Включение очистки, сокращение срока или возврат к включённой наследуемой политике могут удалить данные, которые у вас ещё есть. В обратную сторону это не работает: увеличенные сроки или отключённая очистка не вернут удалённые подробности и не откроют закрытую историю.',
          },
        ],
      },
      {
        id: 'notification-retention',
        title: {
          en: 'Notification history',
          ru: 'История уведомлений',
        },
        paragraphs: [
          {
            en: 'Notification history has its own retention, independent of the runtime one: a new Organization starts with cleanup disabled and a 90-day window. Owners manage it in Profile, Projects can override it in Notifications, and members have read-only access. Only deliveries that reached a final state expire, counted from their latest terminal transition — anything pending, retryable or in flight is preserved.',
            ru: 'У истории уведомлений свои сроки, не связанные со сроками событий: новая организация начинает с выключенной очисткой и окном в 90 дней. Владельцы управляют ими в профиле, проект может переопределить их в разделе уведомлений, а участникам доступно только чтение. Удаляются лишь доставки, дошедшие до конечного состояния, и отсчёт идёт от последнего такого перехода: всё, что ожидает, повторяется или выполняется, сохраняется.',
          },
          {
            en: 'When a delivery expires, its attempts and the linked recovery details go with it, and raising the history period afterwards will not bring them back. So before you enable or shorten either retention policy, look at the effective settings and at what you actually need to keep. Notification cleanup and webhook sending are independent of each other.',
            ru: 'Вместе с истёкшей доставкой удаляются её попытки и связанные подробности восстановления, и увеличение срока хранения потом их не вернёт. Поэтому, прежде чем включать или сокращать любую из политик, посмотрите на действующие настройки и на то, что вам действительно нужно сохранить. Очистка уведомлений и отправка webhook друг от друга не зависят.',
          },
        ],
      },
    ],
    related: ['compatibility-and-limits', 'self-hosting', 'troubleshooting'],
  },
  {
    slug: 'troubleshooting',
    title: {
      en: 'Troubleshooting and FAQ',
      ru: 'Устранение проблем и FAQ',
    },
    intro: {
      en: 'Check access, readiness, collection and stored evidence one at a time.',
      ru: 'Проверяйте доступ, готовность, сбор и сохранённые данные по очереди.',
    },
    sections: [
      {
        id: 'connection',
        title: {
          en: 'The agent does not connect',
          ru: 'Агент не подключается',
        },
        paragraphs: [
          {
            en: 'Start with the plumbing: the configured gRPC endpoint, name resolution, network reachability from the cluster and TLS trust. Then the credential — the token file exists at the configured path, holds the one-time value you saved, and has not been revoked. Never paste that value into a support ticket. After a rotation or any configuration change, roll out the DaemonSet: this release does not reload tokens on the fly.',
            ru: 'Начните с базовых вещей: заданный gRPC endpoint, разрешение имени, сетевая доступность из кластера и доверие к TLS. Затем токен: файл лежит по указанному пути, содержит сохранённое одноразовое значение и не отозван. Само значение никогда не вставляйте в обращение в поддержку. После ротации или любого изменения конфигурации выполните rollout DaemonSet: эта версия не перечитывает токены на лету.',
          },
          {
            en: 'A running Pod proves neither that probes attached nor that the stream authenticated. Read the agent logs and the capability and loss counters it reports. If attachment failed, check BTF, cgroup v2, the kernel version and architecture, the host mounts and the explicit capabilities. A missing required hook is something to fix, not something to hide by switching readiness checks off.',
            ru: 'Работающий Pod не доказывает ни того, что зонды подключились, ни того, что поток прошёл аутентификацию. Прочитайте журналы агента и счётчики возможностей и потерь. Если подключить зонды не удалось, проверьте BTF, cgroup v2, версию и архитектуру ядра, тома узла и явно выданные capabilities. Отсутствующий обязательный хук нужно чинить, а не прятать, отключая проверки готовности.',
          },
        ],
      },
      {
        id: 'empty',
        title: {
          en: 'No events or missing details',
          ru: 'Нет событий или подробностей',
        },
        paragraphs: [
          {
            en: 'First make sure you are looking in the right place: organization, project, application and the time window. Then compare namespace, Deployment name and labels with the configured selector. Generate fresh activity after the stream is connected — a process that was already sitting idle produces no new execution observation. Only then check that the event class is enabled at all, and look at the filtering, rate, queue and kernel-loss counters.',
            ru: 'Сначала убедитесь, что смотрите в нужное место: организация, проект, приложение и временной интервал. Затем сверьте namespace, имя Deployment и метки с настроенным селектором. Создайте новую активность уже после подключения потока: просто работающий процесс нового события запуска не даёт. И только потом проверьте, включён ли нужный класс событий, и посмотрите счётчики фильтрации, скорости, очередей и потерь на уровне ядра.',
          },
          {
            en: 'If the counts are there but the examples are not, the answer is usually coverage and retention: numeric history cannot rebuild event payloads. Missing file observations often come from relative paths, unsupported calls, a lost descriptor mapping or an excluded prefix; missing DNS often comes from encryption, a cache hit, an expired TTL or traffic that never matched. In both cases, an absence of evidence is not evidence of absence.',
            ru: 'Если счётчики есть, а примеров нет, дело обычно в покрытии и сроках хранения: числовая история не восстанавливает содержимое событий. Пропуски в файловых наблюдениях чаще всего объясняются относительными путями, неподдерживаемыми вызовами, утраченным соответствием дескриптора или исключённым префиксом; пропуски в DNS — шифрованием, попаданием в кэш, истёкшим TTL или трафиком, который ни с чем не совпал. И в том, и в другом случае отсутствие данных не равно отсутствию активности.',
          },
        ],
      },
      {
        id: 'web',
        title: {
          en: 'The web interface cannot start',
          ru: 'Веб-интерфейс не запускается',
        },
        paragraphs: [
          {
            en: 'A protected page checks backend compatibility first and the user session second, so the error you get depends on which check failed. Look at /readyz and /api/v1/build-info, at how the reverse proxy routes the API, at the database migration status and at the configured browser origin. If the session simply expired, sign in again — and note that retrying an operation will never turn an organization member into an owner or a system administrator.',
            ru: 'Защищённая страница сначала проверяет совместимость сервера и только затем сессию, поэтому по виду ошибки можно понять, какая проверка не прошла. Посмотрите на /readyz и /api/v1/build-info, на то, как обратный прокси маршрутизирует API, на состояние миграций и на настроенный браузерный origin. Если сессия просто истекла, войдите заново — и учтите, что повтор операции не превратит участника организации во владельца или системного администратора.',
          },
          {
            en: 'If logout or a state-changing POST or PUT fails with untrusted_origin while pages and GET requests still work, compare the browser’s Origin with the trusted value character for character. A chart-managed ingress trusts the derived Origin automatically — https with ingress.web.tlsSecret, otherwise http; external ingress and alternate browser addresses must appear in server.corsOrigins. Match the scheme, host and non-default port, and remove any wildcard, path, query, fragment or trailing slash.',
            ru: 'Если logout или изменяющий состояние POST либо PUT завершается ошибкой untrusted_origin, хотя страницы и GET-запросы работают, посимвольно сравните Origin браузера с доверенным значением. Ingress, созданный чартом, автоматически доверяет выведенному Origin — https с ingress.web.tlsSecret, иначе http; внешний ingress и альтернативные адреса браузера нужно перечислить в server.corsOrigins. Проверьте scheme, host и нестандартный порт и удалите wildcard, путь, query-параметры, fragment и завершающий слеш.',
          },
          {
            en: 'Documentation stays available without a login and without a working API, which makes it a useful signal by itself. If refreshing a direct URL such as /docs/quick-start fails at the web server, it is missing the SPA fallback the other frontend routes use. And if registration is unavailable, ask the installation operator for access instead of assuming your password is wrong.',
            ru: 'Документация доступна без входа и без работающего API — уже поэтому она сама по себе полезный сигнал. Если обновление прямой ссылки вида /docs/quick-start приводит к ошибке веб-сервера, значит для неё не настроен тот же SPA fallback, что и для остальных маршрутов интерфейса. А если регистрация недоступна, запросите доступ у оператора установки, а не считайте, что у вас неверный пароль.',
          },
        ],
      },
      {
        id: 'delivery',
        title: {
          en: 'A notification did not arrive',
          ru: 'Уведомление не пришло',
        },
        paragraphs: [
          {
            en: 'Work through it in order: is there a delivery for that finding, are its destination and rule enabled, and what does worker health say — disabled, retrying or failing? Then read the bounded attempt results for receiver errors, timeouts, DNS or TLS problems and signature validation failures. Delivery trouble does not make the core ingestion API unready, so do not read one as the other.',
            ru: 'Идите по порядку: есть ли для находки запись доставки, включены ли получатель и правило и что говорит состояние обработчика — отключён, повторяет или сбоит. Затем прочитайте ограниченный список попыток: ошибки получателя, тайм-ауты, проблемы DNS или TLS, неудачную проверку подписи. Проблемы с доставкой не делают основной API приёма событий неготовым, так что не путайте одно с другим.',
          },
          {
            en: 'Use the recovery flow only once you know what it will do. A retry keeps the delivery ID and can send the receiver another request, so it relies on the receiver deduplicating; a cancel can collide with work that is already running. When you ask for support, bring versions, timestamps, non-secret configuration and a bounded excerpt of errors and counters — with tokens, private URLs and sensitive workload data removed.',
            ru: 'Восстановлением пользуйтесь, только когда понимаете, что оно сделает. Повтор сохраняет идентификатор доставки и может отправить получателю ещё один запрос, то есть рассчитывает на то, что получатель отсеивает дубликаты; отмена может столкнуться с уже идущей работой. Обращаясь в поддержку, приложите версии, время, несекретную конфигурацию и ограниченную выдержку из ошибок и счётчиков — без токенов, закрытых URL и чувствительных данных нагрузок.',
          },
        ],
      },
    ],
    related: ['quick-start', 'compatibility-and-limits', 'data-and-security', 'self-hosting'],
  },
]
