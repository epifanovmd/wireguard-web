export interface TimeoutEntry {
  timeoutId: any;
  callback: () => void;
}

export class TimeoutManager {
  private readonly ms: number = 10000;
  private timeouts: Map<string, TimeoutEntry> = new Map();

  constructor(ms: number = 0) {
    if (ms > 0) {
      this.ms = ms;
    }
  }

  /**
   * Добавляет или обновляет таймаут по ID
   * @param id Уникальный идентификатор таймаута
   * @param callback Функция, вызываемая по истечении таймаута
   * @param ms Время в миллисекундах
   */
  addTimeout(id: string, callback: () => void): void {
    // Если уже есть таймаут с таким ID - очищаем его
    if (this.timeouts.has(id)) {
      this.clearTimeout(id);
    }

    const startTime = Date.now();

    const timeoutId = setTimeout(() => {
      this.executeAndCleanup(id);
    }, this.ms);

    this.timeouts.set(id, {
      timeoutId,
      callback,
    });
  }

  /**
   * Очищает таймаут по ID
   * @param id ID таймаута
   * @returns true если таймаут был очищен, false если не найден
   */
  clearTimeout(id: string): boolean {
    const entry = this.timeouts.get(id);

    if (!entry) {
      return false;
    }

    clearTimeout(entry.timeoutId);
    this.timeouts.delete(id);

    return true;
  }

  /**
   * Очищает все активные таймауты
   */
  clearAll(): void {
    for (const [_id, entry] of this.timeouts) {
      clearTimeout(entry.timeoutId);
    }
    this.timeouts.clear();
  }

  /**
   * Уничтожает менеджер, очищая все таймауты
   */
  destroy(): void {
    this.clearAll();
  }

  /**
   * Выполняет колбэк и очищает запись
   * @param id ID таймаута
   */
  private executeAndCleanup(id: string): void {
    const entry = this.timeouts.get(id);

    if (!entry) return;

    try {
      entry.callback();
    } catch {
      //
    } finally {
      this.timeouts.delete(id);
    }
  }
}
