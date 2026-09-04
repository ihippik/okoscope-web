import type { Locale } from '../../shared/i18n'

type Localized = Record<Locale, string>
export type Article = {
  slug: string
  title: Localized
  intro: Localized
  sections: {
    id: string
    title: Localized
    paragraphs: Localized[]
    diagram?: {
      source: Localized
      alt: Localized
    }
    code?: string
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
    repository: 'Open deployment sources on GitHub',
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
    repository: 'Открыть исходные манифесты на GitHub',
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
            en: 'If your team already runs Okoscope, go through Quick start together with an organization owner and whoever administers the cluster. If nobody has installed it yet, start with Self-hosting instead. Either way, read Compatibility and limits before you plan a wider rollout: the agent supports one specific Linux and Kubernetes profile, and it is much cheaper to learn that now than halfway through.',
            ru: 'Если команда уже пользуется Okoscope, пройдите быстрый старт вместе с владельцем организации и тем, кто администрирует кластер. Если установки ещё нет, начните с самостоятельного развёртывания. И в том, и в другом случае прочитайте раздел о совместимости и ограничениях до того, как планировать внедрение: агент работает только с определённым профилем Linux и Kubernetes, и узнать об этом заранее гораздо дешевле, чем на полпути.',
          },
        ],
      },
    ],
    related: ['quick-start', 'how-it-works', 'compatibility-and-limits'],
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
      en: 'Quick start',
      ru: 'Быстрый старт',
    },
    intro: {
      en: 'Connect a single Deployment to an installation someone already runs, and check that the first event arrives.',
      ru: 'Подключите один Deployment к уже работающей установке и убедитесь, что первое событие дошло.',
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
            en: 'Ask whoever operates the installation for the web address, a gRPC endpoint reachable from the cluster, the CA certificate and access to an Organization. Registration may be switched off; where it is open, signing up makes you the owner of a new organization, not a system administrator. Members can read data, but creating Projects and Applications inside an organization takes an owner or the system administrator.',
            ru: 'Попросите у того, кто обслуживает установку, адрес сайта, доступный из кластера gRPC endpoint, сертификат CA и доступ к организации. Регистрация может быть отключена; если она открыта, при регистрации вы становитесь владельцем новой организации, а не системным администратором. Участники могут читать данные, но создавать проекты и приложения в организации вправе владелец или системный администратор.',
          },
          {
            en: 'In Projects, pick or create a Project, then create an Application. An owner can do this inside their own organization; the global onboarding and discovery flows need the separate system admin credential. The response contains an oko_app_v1_ token — save it right away, because the full value is shown exactly once. Keep it out of ConfigMaps, Git, screenshots and logs.',
            ru: 'В разделе проектов выберите или создайте проект, а затем создайте приложение. Владельцу это доступно в своей организации; глобальный мастер подключения и поиск требуют отдельного системного токена. В ответе придёт токен oko_app_v1_ — сохраните его сразу, потому что полное значение показывается ровно один раз. Не оставляйте его в ConfigMap, Git, скриншотах и журналах.',
          },
        ],
      },
      {
        id: 'configure',
        title: {
          en: '2. Configure one workload',
          ru: '2. Настройте одну нагрузку',
        },
        paragraphs: [
          {
            en: 'You will need a node that matches the supported profile and a Kubernetes operator who can install the agent DaemonSet and its RBAC. Clone https://github.com/ihippik/okoscope and start from deploy/kubernetes/agent. The example below is the complete agent.yaml that goes into the ConfigMap; replace the endpoint and the workload values with your own. You can leave nodeName alone: the DaemonSet overrides it with OKOSCOPE_NODE_NAME from the downward API.',
            ru: 'Понадобится узел с поддерживаемым профилем и оператор Kubernetes, который сможет установить DaemonSet агента и его RBAC. Склонируйте https://github.com/ihippik/okoscope и начните с deploy/kubernetes/agent. Ниже — полное содержимое agent.yaml для ConfigMap; подставьте свои endpoint и параметры нагрузки. Значение nodeName можно не трогать: DaemonSet переопределит его переменной OKOSCOPE_NODE_NAME из downward API.',
          },
          {
            en: 'By the time the agent starts, the credential file and the CA file have to be there, both mounted read-only from Secrets. Mount the application token at exactly the path you configured, and add the CA file to the projected volume. The reference DaemonSet mounts a key called payment-api; if you rename it, rename the Secret item and the selector together, or the agent will look for a file that is not there. Use HTTPS with a matching server certificate — developmentPlaintext exists for isolated development and nothing else.',
            ru: 'К моменту запуска агента файл токена и файл CA должны быть на месте: оба монтируются из Secret только для чтения. Токен приложения смонтируйте ровно по тому пути, который указан в конфигурации, а файл CA добавьте в projected volume. В эталонном DaemonSet используется ключ payment-api; если переименовываете его, меняйте ключ Secret и селектор согласованно, иначе агент будет искать несуществующий файл. Используйте HTTPS с подходящим серверным сертификатом, а developmentPlaintext нужен только для изолированной разработки.',
          },
        ],
        code: 'apiVersion: okoscope.io/v1alpha1\nkind: AgentConfiguration\nserver:\n  endpoint: https://<grpc-host>:4317\n  caFile: /var/run/secrets/okoscope/ca.crt\nidentity:\n  nodeName: overridden-by-downward-api\n  clusterName: example-cluster\nscope:\n  workloads:\n    - applicationCredentialFile: /var/run/secrets/okoscope/applications/payment-api\n      namespace: production\n      kind: Deployment\n      name: payment-api\n      labels:\n        app: payment-api\nobservation:\n  processExec: true\n  processExit: true\n  syscalls: [ptrace, setns]\n  network:\n    connect: true\nsafety:\n  queueCapacity: 4096\n  batchSize: 256\n  maxEventsPerSecond: 1000\n  maxApplicationStreams: 32',
      },
      {
        id: 'secret-mount',
        headingLevel: 3,
        title: { en: 'Mount the token and CA', ru: 'Смонтируйте токен и CA' },
        paragraphs: [
          {
            en: 'In deploy/kubernetes/agent/daemonset.yaml, replace the projected sources of the existing secrets volume with the fragment below, and leave its read-only mount at /var/run/secrets/okoscope as it is. Both keys have to exist in the Secret you create in the next step.',
            ru: 'В файле deploy/kubernetes/agent/daemonset.yaml замените projected sources у существующего тома secrets на фрагмент ниже, а его подключение только для чтения по пути /var/run/secrets/okoscope оставьте как есть. Оба ключа должны быть в Secret, который вы создадите на следующем шаге.',
          },
        ],
        code: `- name: secrets
  projected:
    defaultMode: 0400
    sources:
      - secret:
          name: okoscope-application-credentials
          items:
            - key: payment-api
              path: applications/payment-api
            - key: ca.crt
              path: ca.crt`,
      },
      {
        id: 'deploy',
        title: {
          en: '3. Install and check',
          ru: '3. Установите и проверьте',
        },
        paragraphs: [
          {
            en: 'Put the one-time token into a protected local file with your secret-management tool. In the commands below, substitute your own context and file paths; the namespace has to exist already. Create the Secret once — if the credentials are already there, update them the way you normally update secrets. Add the CA projection to the agent manifest before you deploy, not after.',
            ru: 'Положите одноразовый токен в защищённый локальный файл средствами управления секретами. В командах ниже подставьте свой контекст и пути к файлам; пространство имён должно существовать заранее. Secret создаётся один раз — если токены уже заведены, обновляйте их обычной для вас процедурой. Проекцию CA добавьте в манифест агента до развёртывания, а не после.',
          },
          {
            en: 'Build a Kustomize overlay for your installation on top of deploy/kubernetes/agent: the ConfigMap you just reviewed, the Secret mounts, and a real immutable agent image tag in place of the all-zero placeholder. Make sure the selector matches a Deployment that actually exists, namespace and labels included. Render the manifests and read the output before you apply it — installing agents takes host-level permissions, which Data and security describes in full.',
            ru: 'Соберите Kustomize overlay для своей установки на основе deploy/kubernetes/agent: проверенный ConfigMap, тома Secret и настоящий неизменяемый тег образа агента вместо нулевой заглушки. Убедитесь, что селектор совпадает с реально существующим Deployment, вместе с namespace и метками. Соберите манифесты и прочитайте результат до применения: установка агентов требует прав на уровне узла, и они подробно описаны в разделе о данных и безопасности.',
          },
        ],
        code: 'kubectl --context <your-context> -n okoscope create secret generic okoscope-application-credentials   --from-file=payment-api=<protected-token-file>   --from-file=ca.crt=<ca-certificate-file>\nkubectl --context <your-context> kustomize <agent-overlay-directory>\nkubectl --context <your-context> apply -k <agent-overlay-directory>\nkubectl --context <your-context> -n okoscope rollout status daemonset/okoscope-agent --timeout=5m\nkubectl --context <your-context> -n okoscope logs daemonset/okoscope-agent --tail=100',
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
      en: 'Self-hosting',
      ru: 'Самостоятельное развёртывание',
    },
    intro: {
      en: 'Run the server, the database and the web interface yourself, then point your agents at them.',
      ru: 'Разверните сервер, базу данных и веб-интерфейс у себя, а затем направьте на них агентов.',
    },
    sections: [
      {
        id: 'components',
        title: {
          en: 'Infrastructure and deployment sources',
          ru: 'Инфраструктура и исходные манифесты',
        },
        paragraphs: [
          {
            en: 'You need a Kubernetes installation, PostgreSQL, kubectl with Kustomize support, and immutable images for the server, the agent and the web interface. The agent is pickier than the rest: server images are published for linux/amd64 and linux/arm64, while a supported agent needs x86_64. If you route the installation publicly, Traefik and cert-manager CRDs are an optional extra.',
            ru: 'Понадобятся установка Kubernetes, PostgreSQL, kubectl с поддержкой Kustomize и неизменяемые образы сервера, агента и веб-интерфейса. Агент требовательнее остальных: серверные образы публикуются для linux/amd64 и linux/arm64, а поддерживаемому агенту нужен x86_64. Для публичной маршрутизации при желании используются CRD Traefik и cert-manager.',
          },
          {
            en: 'Clone https://github.com/ihippik/okoscope and look through deploy/kubernetes/common along with the server, agent and frontend directories beside it. The common Kustomization wires up the stateless components; it does not create PostgreSQL or any Secrets for you. Build your own site overlay with your images, endpoints, workload selectors, volumes and resource limits, and never apply the base placeholders unchanged.',
            ru: 'Склонируйте https://github.com/ihippik/okoscope и изучите deploy/kubernetes/common, а рядом — каталоги server, agent и frontend. Общая сборка Kustomize связывает компоненты без состояния, но PostgreSQL и Secret она не создаёт. Соберите собственный overlay со своими образами, адресами, селекторами нагрузок, томами и лимитами ресурсов и никогда не применяйте базовые шаблоны без изменений.',
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
            en: 'Create the namespace from deploy/kubernetes/common/namespace.yaml. For the database, either use PostgreSQL you already manage, or review the storage settings and apply deploy/kubernetes/common/postgres.yaml once for a new bundled installation. The bundled database runs a single replica and is not highly available, so plan around that. Confirm PostgreSQL is reachable before you run migrations.',
            ru: 'Создайте пространство имён из deploy/kubernetes/common/namespace.yaml. Для базы данных либо используйте свою PostgreSQL, либо проверьте настройки хранилища и один раз примените deploy/kubernetes/common/postgres.yaml — для новой встроенной установки. Встроенная база работает в одну реплику и не обеспечивает высокую доступность, учитывайте это при планировании. Перед миграциями убедитесь, что PostgreSQL доступна.',
          },
          {
            en: 'Treat deploy/kubernetes/common/secret.example.yaml as a list of keys and nothing more. Create okoscope-secrets through your secret manager with database-url, postgres-password, admin-credential, webhook-encryption-key and identity-token-key. The webhook key is 32 random bytes written as 64 hexadecimal characters; the admin and identity keys need at least 32 random bytes each. Application credentials live in their own Secret. Keep every one of these values out of your command history and out of version control.',
            ru: 'Файл deploy/kubernetes/common/secret.example.yaml — это перечень ключей и ничего больше. Через менеджер секретов создайте okoscope-secrets с database-url, postgres-password, admin-credential, webhook-encryption-key и identity-token-key. Ключ webhook — это 32 случайных байта, записанных как 64 шестнадцатеричных символа; ключам admin и identity нужно не меньше 32 случайных байтов каждому. Токены приложений хранятся в отдельном Secret. Ни одно из этих значений не должно попасть в историю команд и в систему контроля версий.',
          },
        ],
      },
      {
        id: 'rollout',
        title: {
          en: 'Migrate, then roll out',
          ru: 'Миграция, затем развёртывание',
        },
        paragraphs: [
          {
            en: 'Use a source checkout that matches the server release you are deploying. make migrate fills the migration Job with the image, the name and the required schema version; apply the raw migration base instead and the placeholders simply stay there. The overlay you pass has to declare the server image name and a quoted 40-character newTag directly in kustomization.yaml, because that is where the target reads them from. Always set the context explicitly — a repository default can quietly point at someone else’s cluster.',
            ru: 'Берите исходники той версии сервера, которую разворачиваете. Команда make migrate подставляет в Job образ, имя и требуемую версию схемы; если применить базовый шаблон миграции напрямую, заглушки так и останутся на месте. В overlay имя серверного образа и newTag из 40 символов в кавычках должны быть объявлены прямо в kustomization.yaml — команда читает их именно оттуда. Контекст всегда задавайте явно: настройка из репозитория может незаметно указывать на чужой кластер.',
          },
          {
            en: 'The common manifests are set up for development: agent transport is plaintext and registration is disabled in the server manifest. Before you expose anything, configure TLS for gRPC and HTTPS for the web and API, list the browser origins you trust, and point the server at its mounted certificate and key. On the web side, set the runtime API routing and keep the SPA fallback so direct article URLs survive a refresh. Create the first owner with the operator command bootstrap-owner, injecting the password through a protected channel.',
            ru: 'Общие манифесты рассчитаны на разработку: транспорт агента открытый, а регистрация в манифесте сервера отключена. Прежде чем что-то публиковать, настройте TLS для gRPC и HTTPS для сайта и API, перечислите доверенные браузерные origins и укажите серверу смонтированные сертификат и ключ. На стороне интерфейса настройте маршрутизацию API и сохраните SPA fallback, чтобы прямые ссылки на статьи переживали обновление страницы. Первого владельца создайте операторской командой bootstrap-owner, передав пароль защищённым способом.',
          },
          {
            en: 'When the migration succeeds, apply the overlay you reviewed. You are done when /readyz answers, /api/v1/build-info reports a compatible version, you can sign in, a deep link still works after a refresh, and one agent event arrives with the right attribution. A failed migration is a stop sign: fix it before rolling out the application. Troubleshooting explains how to tell readiness problems from collection problems.',
            ru: 'После успешной миграции примените проверенный overlay. Готово, когда отвечает /readyz, /api/v1/build-info сообщает совместимую версию, вход выполняется, прямая ссылка переживает обновление страницы и приходит хотя бы одно правильно привязанное событие агента. Неудачная миграция — стоп-сигнал: устраните причину до обновления приложения. Как отличить проблемы готовности от проблем со сбором, описано в разделе устранения проблем.',
          },
        ],
        code: 'make migrate KUBE_CONTEXT=<your-context> KUBE_NAMESPACE=okoscope KUSTOMIZE_DIR=<site-overlay-directory>\nkubectl --context <your-context> apply -k <site-overlay-directory>\nkubectl --context <your-context> -n okoscope rollout status deployment/okoscope-server --timeout=5m\nkubectl --context <your-context> -n okoscope rollout status deployment/okoscope-web --timeout=5m',
      },
      {
        id: 'backups',
        title: {
          en: 'Backups and upgrades',
          ru: 'Резервные копии и обновления',
        },
        paragraphs: [
          {
            en: 'Back up PostgreSQL before every upgrade, and test the restore into a separate database: a backup you have never restored is a guess. Keep encrypted copies outside the cluster, because a PVC is not a backup. Back up your encryption keys separately, keeping the ones needed to read stored secrets. Expect the database to grow, and measure real load before you settle on resource limits.',
            ru: 'Делайте резервную копию PostgreSQL перед каждым обновлением и проверяйте восстановление в отдельную базу: копия, которую ни разу не разворачивали, — это предположение. Зашифрованные копии храните вне кластера, потому что PVC резервной копией не является. Ключи шифрования сохраняйте отдельно, включая те, без которых не прочитать сохранённые секреты. Закладывайте рост базы и измеряйте реальную нагрузку, прежде чем фиксировать лимиты ресурсов.',
          },
          {
            en: 'If a release needs a new schema, run the migration explicitly first: a normal server start uses OKOSCOPE_MIGRATE=false. Roll an image back only when the older release can work with the schema and retention boundaries you now have. Never delete migration records or persistent data to force a rollback through. Once evidence is deleted, only a backup brings it back.',
            ru: 'Если версия требует новую схему, сначала выполните миграцию явно: обычный запуск сервера идёт с OKOSCOPE_MIGRATE=false. Возвращайтесь к старому образу, только если он совместим с текущей схемой и границами хранения. Никогда не удаляйте записи миграций и постоянные данные ради того, чтобы протолкнуть откат. Удалённые данные вернёт только резервная копия.',
          },
        ],
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
        code: 'observation:\n  files:\n    enabled: true\n    operations: [create, modify, delete, rename]\n    includePaths: [/app/data]\n    excludePaths: [/app/data/private]',
      },
      {
        id: 'review',
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
