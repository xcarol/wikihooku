import parseInfo from 'infobox-parser';
import dayjs from 'dayjs';

const _isSimpleDate = (date) => date && dayjs(date).isValid();
const _isDateDate = (date) => date && date.date && dayjs(date.date).isValid();
const _objectDate = (date) => {
  const length = date?.length;

  if (length) {
    for (let pos = 0; pos < length; pos += 1) {
      const obDate = date[pos]?.date;
      const datejs = dayjs(obDate);

      if (obDate && datejs.isValid()) {
        return datejs.toJSON();
      };
    }
  }

  return undefined;
};
const _stringDate = (date) => {

  if (date && typeof(date) === 'string') {
    const lowercaseDate = date?.toLowerCase();
    
    if (lowercaseDate.includes('or')) {
      const dates = lowercaseDate.split('or');

      for (let pos = 0; pos < dates.length; pos += 1) {
        const datejs = dayjs(dates[pos]);

        if (datejs.isValid()) {
          return datejs.toJSON();
        };
      }
    }
  }

  return undefined;
};

const _parseBirthDate = (infoBox) => {
  const { birthDate } = infoBox.general;

  if (_isSimpleDate(birthDate)) {
    return dayjs(birthDate).toJSON();
  }

  if (_isDateDate(birthDate)) {
    return dayjs(birthDate.date).toJSON();
  }

  return _objectDate(birthDate) || _stringDate(birthDate);
};

const _parseDeathDate = (infoBox) => {
  const { deathDate } = infoBox.general;

  if (_isSimpleDate(deathDate)) {
    return dayjs(deathDate).toJSON();
  }

  if (_isDateDate(deathDate)) {
    return dayjs(deathDate.date).toJSON();
  }

  return _objectDate(deathDate);
};

export default class WikiPerson {
  setPerson(id, name, birthDate, deathDate) {
    this.id = id;
    this.name = name;
    this.birthDate = birthDate;
    this.deathDate = deathDate;
  }

  setFromSearch(item) {
    const infoBox = parseInfo(item.content);
    this.id = item.value;
    this.name = infoBox.general.name || item.title;
    this.birthDate = _parseBirthDate(infoBox);
    this.deathDate = _parseDeathDate(infoBox);
  };

  getBirthDate() {
    if (!this.birthDate) {
      return undefined;
    }
    const parsedDate = new Date(this.birthDate);
    return Number.isNaN(parsedDate) ? undefined : parsedDate;
  }
};

export const wikiDate = (JSONDate) => new Date(JSONDate || Date.now());
