import parseInfo from 'infobox-parser';
import dayjs from 'dayjs';

class WikiPerson {
  _parseBirthDate() {
    if (
      this.infoBox.general.birthDate &&
      this.infoBox.general.birthDate.date &&
      dayjs(this.infoBox.general.birthDate.date).isValid()
    ) {
      return this.infoBox.general.birthDate.date;
    }

    if (
      this.infoBox.general.birthDate.length &&
      this.infoBox.general.birthDate[0].date &&
      dayjs(this.infoBox.general.birthDate[0].date).isValid()
    ) {
      return this.infoBox.general.birthDate[0].date;
    }

    return undefined;
  };

  _parseDeathDate() {
    if (
      this.infoBox.general.deathDate &&
      this.infoBox.general.deathDate.date &&
      dayjs(this.infoBox.general.deathDate.date).isValid()
    ) {
      return this.infoBox.general.deathDate.date;
    }

    return undefined;
  }

  setPerson(id, name, birthDate, deathDate) {
    this.infoBox = undefined;
    this.id = id;
    this.name = name;
    this.birthDate = birthDate;
    this.deathDate = deathDate;
  }

  setFromPageInfo(pageInfo) {
    this.infoBox = parseInfo(pageInfo);
    this.id = this.infoBox.pageId;
    this.name = this.infoBox.general.name;
    this.birthDate = this._parseBirthDate();
    this.deathDate = this._parseDeathDate();
  };

  getBirthDate() {
    if (!this.birthDate) {
      return undefined;
    }
    const parsedDate = new Date(this.birthDate);
    return Number.isNaN(parsedDate) ? undefined : parsedDate;
  }
};

export default WikiPerson;
