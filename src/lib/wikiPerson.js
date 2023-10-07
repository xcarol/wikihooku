import parseInfo from 'infobox-parser';
import dayjs from 'dayjs';

const _parseBirthDate = (infoBox) => {
  if (
    infoBox.general.birthDate &&
    infoBox.general.birthDate.date &&
    dayjs(infoBox.general.birthDate.date).isValid()
  ) {
    return dayjs(infoBox.general.birthDate.date).toJSON();
  }

  const dateLength = infoBox.general.birthDate.length;
  
  if (dateLength) {
    for (let pos = 0; pos < dateLength; pos += 1) {
      const date = infoBox.general.birthDate[pos]?.date;
      const datejs = dayjs(date);

      if (date && datejs.isValid()) {
        return datejs.toJSON();
      };
    }
  }

  return undefined;
};

const _parseDeathDate = (infoBox) => {
  if (
    infoBox.general.deathDate &&
    infoBox.general.deathDate.date &&
    dayjs(infoBox.general.deathDate.date).isValid()
  ) {
    return dayjs(infoBox.general.deathDate.date).toJSON();
  }

  return undefined;
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
