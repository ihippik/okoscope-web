import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  LocalizationProvider,
  englishMessages,
  formatDateTime,
  formatNumber,
  LANGUAGE_STORAGE_KEY,
  pluralCategory,
  resolveLocale,
  russianMessages,
  translate,
  useLocalization,
} from '.'

describe('localization', () => {
  it('keeps dictionary keys aligned and interpolates values', () => {
    expect(Object.keys(russianMessages).sort()).toEqual(Object.keys(englishMessages).sort())
    expect(translate('ru', 'errorCode', { code: 'E_42' })).toBe('Код ошибки: E_42')
  })
  it('resolves saved, browser, and fallback locales', () => {
    expect(resolveLocale({ getItem: () => 'ru' }, ['en-US'])).toBe('ru')
    expect(resolveLocale({ getItem: () => null }, ['fr', 'ru-RU'])).toBe('ru')
    expect(resolveLocale({ getItem: () => null }, ['fr'])).toBe('en')
    expect(
      resolveLocale(
        {
          getItem: () => {
            throw new Error('denied')
          },
        },
        ['ru'],
      ),
    ).toBe('ru')
  })
  it('switches immediately, persists, and updates document language', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LocalizationProvider initialLocale="en">{children}</LocalizationProvider>
    )
    const { result } = renderHook(useLocalization, { wrapper })
    act(() => result.current.setLocale('ru'))
    expect(result.current.t('projects')).toBe('Проекты')
    expect(document.documentElement.lang).toBe('ru')
    expect(setItem).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY, 'ru')
  })
  it('formats values with an explicit locale', () => {
    expect(formatNumber('en', 1234)).not.toBe(formatNumber('ru', 1234))
    expect(
      formatDateTime('ru', new Date('2025-01-02T12:00:00Z'), {
        timeZone: 'UTC',
        dateStyle: 'medium',
      }),
    ).toContain('2025')
    expect(pluralCategory('ru', 2)).toBe('few')
  })
  it('translates complete dynamic UI states without mixing languages', async () => {
    function DynamicButton() {
      const [saving, setSaving] = useState(false)
      return (
        <button onClick={() => setSaving(true)}>{saving ? 'Saving…' : 'Create destination'}</button>
      )
    }
    render(
      <LocalizationProvider initialLocale="ru">
        <DynamicButton />
      </LocalizationProvider>,
    )
    const button = await screen.findByRole('button', { name: 'Создать назначение' })
    fireEvent.click(button)
    expect(await screen.findByRole('button', { name: 'Сохранение…' })).toBeVisible()
  })
})
