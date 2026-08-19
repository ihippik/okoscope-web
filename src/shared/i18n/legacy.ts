import type { Locale } from '.'

/** Dictionary-backed compatibility boundary for existing JSX surfaces. */
export const legacyRussian: Record<string, string> = {
  Language: 'Язык',
  English: 'Английский',
  Russian: 'Русский',
  Primary: 'Основная навигация',
  'End session': 'Завершить сеанс',
  'Compatible API · v1': 'Совместимый API · v1',
  'Connect to Okoscope': 'Подключиться к Okoscope',
  "Your bearer credential stays in this page's memory and disappears on reload.":
    'Учетные данные bearer хранятся только в памяти этой страницы и исчезнут после перезагрузки.',
  'Bearer credential': 'Учетные данные bearer',
  'Start session': 'Начать сеанс',
  'Checking backend compatibility…': 'Проверяем совместимость сервера…',
  'Backend unavailable': 'Сервер недоступен',
  'Incompatible deployment': 'Несовместимое развертывание',
  'Incompatible backend': 'Несовместимый сервер',
  Expected: 'Ожидается',
  Actual: 'Фактически',
  Service: 'Сервис',
  Commit: 'Коммит',
  'Required migration': 'Требуемая миграция',
  'Actual migration': 'Фактическая миграция',
  'or newer': 'или новее',
  unknown: 'неизвестно',
  'Page not found': 'Страница не найдена',
  'Not found': 'Не найдено',
  'Configuration error': 'Ошибка конфигурации',
  'Okoscope cannot start': 'Не удалось запустить Okoscope',
  'Runtime configuration could not be loaded.':
    'Не удалось загрузить конфигурацию среды выполнения.',
  'Loading…': 'Загрузка…',
  Close: 'Закрыть',
  'Something went wrong': 'Что-то пошло не так',
  'An unexpected error occurred.': 'Произошла непредвиденная ошибка.',
  'Error code:': 'Код ошибки:',
  'Request ID:': 'ID запроса:',
  'Try again': 'Повторить',
  Organization: 'Организация',
  Project: 'Проект',
  Projects: 'Проекты',
  Application: 'Приложение',
  Applications: 'Приложения',
  Notifications: 'Уведомления',
  Configuration: 'Конфигурация',
  Diagnostics: 'Диагностика',
  Releases: 'Релизы',
  'Runtime groups': 'Группы среды выполнения',
  'Runtime Groups': 'Группы среды выполнения',
  'Runtime Group': 'Группа среды выполнения',
  'Runtime Inventory': 'Инвентаризация среды выполнения',
  'Runtime inventory': 'Инвентаризация среды выполнения',
  'Runtime Diff': 'Различия среды выполнения',
  'Explore your environment': 'Исследуйте свою среду',
  'Browse Projects and their Applications.': 'Просматривайте проекты и их приложения.',
  'View projects': 'Открыть проекты',
  'No projects yet': 'Проектов пока нет',
  'This Organization has no Projects.': 'В этой организации нет проектов.',
  'No applications yet': 'Приложений пока нет',
  'This Project has no Applications.': 'В этом проекте нет приложений.',
  'Project sections': 'Разделы проекта',
  Breadcrumb: 'Навигационная цепочка',
  'Latest observation': 'Последнее наблюдение',
  Created: 'Создано',
  Updated: 'Обновлено',
  'Runtime observability': 'Наблюдаемость среды выполнения',
  Any: 'Любой',
  Open: 'Открыто',
  Acknowledged: 'Подтверждено',
  Resolved: 'Решено',
  'Apply filters': 'Применить фильтры',
  'First-seen event ID': 'ID первого события',
  'First seen': 'Впервые замечено',
  'Last seen': 'Последний раз замечено',
  Occurrences: 'Наблюдения',
  'Status changed': 'Статус изменен',
  Cluster: 'Кластер',
  'Representative event': 'Репрезентативное событие',
  'No occurrences': 'Нет наблюдений',
  'Lifecycle actions': 'Действия жизненного цикла',
  'Search observed identity': 'Поиск наблюдаемого объекта',
  'Executable, command, destination, domain, or syscall':
    'Исполняемый файл, команда, назначение, домен или системный вызов',
  'Active scope': 'Активная область',
  'Runtime inventory summary': 'Сводка инвентаризации',
  'Inventory behavior kind': 'Тип поведения',
  'Unsupported identity': 'Неподдерживаемый объект',
  'First observed': 'Первое наблюдение',
  'Last observed': 'Последнее наблюдение',
  'Scope and filters': 'Область и фильтры',
  Release: 'Релиз',
  'All releases': 'Все релизы',
  'Observed from': 'Наблюдалось с',
  'Observed to': 'Наблюдалось до',
  'Release evidence': 'Данные релиза',
  Namespace: 'Пространство имен',
  Pod: 'Под',
  Container: 'Контейнер',
  Observed: 'Наблюдалось',
  Workload: 'Рабочая нагрузка',
  Command: 'Команда',
  Node: 'Узел',
  Evidence: 'Данные',
  'Inventory evidence': 'Данные инвентаризации',
  'Deployment history': 'История развертываний',
  'No releases yet': 'Релизов пока нет',
  'Release history will appear here.': 'Здесь появится история релизов.',
  'Release comparison': 'Сравнение релизов',
  'Backend-selected baseline': 'Базовый релиз выбран сервером',
  Target: 'Целевой релиз',
  Baseline: 'Базовый релиз',
  'First-seen notification': 'Уведомление о первом обнаружении',
  Deliveries: 'Доставки',
  Succeeded: 'Успешно',
  Failed: 'Неудачно',
  'Unknown value': 'Неизвестное значение',
  Process: 'Процесс',
  Name: 'Имя',
  'Query type': 'Тип запроса',
  Response: 'Ответ',
  Transport: 'Транспорт',
  Destination: 'Назначение',
  Port: 'Порт',
  Outcome: 'Результат',
  Direction: 'Направление',
  Resolver: 'Резолвер',
  Answers: 'Ответы',
  'Project operations': 'Операции проекта',
  'Notification health': 'Состояние уведомлений',
  'Health data is stale': 'Данные о состоянии устарели',
  'Create destination': 'Создать назначение',
  'No webhook destinations': 'Нет назначений webhook',
  'Create webhook destination': 'Создать назначение webhook',
  'Webhook destination': 'Назначение webhook',
  Backfill: 'Ретроспективная отправка',
  Revision: 'Ревизия',
  Disabled: 'Отключено',
  Edit: 'Изменить',
  'Save the signing secret now': 'Сохраните секрет подписи сейчас',
  'Copy secret': 'Копировать секрет',
  'Secret copied to clipboard.': 'Секрет скопирован в буфер обмена.',
  'No notification deliveries': 'Нет доставок уведомлений',
  'Notification delivery': 'Доставка уведомления',
  Event: 'Событие',
  Origin: 'Источник происхождения',
  Source: 'Источник',
  'Semantic event': 'Семантическое событие',
  Attempts: 'Попытки',
  Available: 'Доступно',
  'Next attempt': 'Следующая попытка',
  'Terminal outcome': 'Конечный результат',
  'No attempts recorded.': 'Попытки не зарегистрированы.',
  Started: 'Начато',
  Finished: 'Завершено',
  Duration: 'Длительность',
  'Notification operations': 'Операции с уведомлениями',
  'Recovery history': 'История восстановления',
  'Recovery operation': 'Операция восстановления',
  'Recovery actions': 'Действия восстановления',
  'Retry delivery': 'Повторить доставку',
  'Cancel delivery': 'Отменить доставку',
  'Bulk retry failed deliveries': 'Массово повторить неудачные доставки',
  'All commands': 'Все команды',
  Retry: 'Повторить',
  Cancel: 'Отменить',
  'Bulk retry': 'Массовый повтор',
  'No recovery operations recorded.': 'Операции восстановления не зарегистрированы.',
  Actor: 'Исполнитель',
  Selected: 'Выбрано',
  Retried: 'Повторено',
  Cancelled: 'Отменено',
  Skipped: 'Пропущено',
  Remaining: 'Осталось',
  Completed: 'Завершено',
  'Affected deliveries': 'Затронутые доставки',
}

let originals = new WeakMap<Node, string>()
let attributeOriginals = new WeakMap<Element, Map<string, string>>()
const attributes = ['aria-label', 'placeholder', 'title']
function localize(value: string, locale: Locale) {
  if (locale === 'en') return value
  const exact = legacyRussian[value.trim()]
  if (exact) return value.replace(value.trim(), exact)
  let result = value
  for (const [en, ru] of Object.entries(legacyRussian).sort(([a], [b]) => b.length - a.length))
    result = result.replaceAll(en, ru)
  return result
}

export function localizeDocument(locale: Locale, root: ParentNode = document) {
  let applying = false
  let originalTitle = document.title
  let renderedTitle = document.title
  const apply = () => {
    if (applying) return
    applying = true
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      if (!originals.has(node)) originals.set(node, node.textContent ?? '')
      const next = localize(originals.get(node)!, locale)
      if (node.textContent !== next) node.textContent = next
    }
    for (const element of root.querySelectorAll('*'))
      for (const attribute of attributes) {
        const current = element.getAttribute(attribute)
        if (current === null) continue
        let saved = attributeOriginals.get(element)
        if (!saved) {
          saved = new Map()
          attributeOriginals.set(element, saved)
        }
        if (!saved.has(attribute)) saved.set(attribute, current)
        const next = localize(saved.get(attribute)!, locale)
        if (next !== current) element.setAttribute(attribute, next)
      }
    if (document.title !== renderedTitle) originalTitle = document.title
    renderedTitle = localize(originalTitle, locale)
    if (document.title !== renderedTitle) document.title = renderedTitle
    applying = false
  }
  apply()
  if (locale === 'en') {
    originals = new WeakMap<Node, string>()
    attributeOriginals = new WeakMap<Element, Map<string, string>>()
    return () => undefined
  }
  const observer = new MutationObserver(apply)
  observer.observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: attributes,
  })
  return () => observer.disconnect()
}
