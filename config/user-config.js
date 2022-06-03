
var url = () => {
  if(process.env.DOCKER_RUNNING){
     return 'https://odc-manager-indaspaceplus.apps.osc.fokus.fraunhofer.de/ '
  } else {
    return 'http://localhost:8080/'
  }

}

const glueConfig = {

  apiBaseUrl: url(),

  //apiBaseUrl: 'https://public-data-space-connector-indaspaceplus.apps.osc.fokus.fraunhofer.de/',

  title: 'Public Data Space',
  expandDrawerOnHover: false,
  snackbarTimeout: 5000,
  snackbarTexts: {
    brokers: {
      submit: {
        success: 'Broker erfolgreich registriert!',
        error: 'Broker konnt leider nicht registriert werden ...',
        input: 'Bitte die Broker URL eingeben!',
      },
      toggle: {
        success: 'Brokerstatus erfolgreich geändert!',
      },
      delete: {
        success: 'Broker erfolgreich gelöscht!',
      },
    },
    connector: {
      load: {
        success: 'JSON erfolgreich geladen!',
        error: 'JSON konnte leider nicht geladen werden ...',
      },
    },
    dataAssets: {
      publish: {
        success: 'Data Asset(s) erfolgreich veröffentlicht!',
        error: 'Data Asset(s) konnten leider nicht veröffentlicht werden ...',
      },
      unpublish: {
        success: 'Data Asset(s) nicht mehr veröffentlicht!',
        error: 'Data Asset(s) sind leider immer noch veröffentlicht ...',
      },
      delete: {
        success: 'Data Asset(s) erfolgreich gelöscht!',
        error: 'Data Asset(s) konnten leider nicht gelöscht werden ...',
      },
      keywords: {
        success: 'Keywords für Data Asset erfolgreich generiert!',
        error: 'Keywords für Data Asset konnten leider nicht generiert werden ...',
      }
    },
    jobs: {
      delete: {
        success: 'Job erfolgreich gelöscht!',
      },
    },
    settings: {
      submit: {
        success: 'Einstellungen erfolgreich geändert!',
        error: 'Einstellungen konnten leider nicht geändert werden ...',
      }
    },
    auth: {
      login: {
        success: 'Login erfolgreich!',
        error: 'Login ist leider fehlgeschlagen ...',
      },
      logout: {
        success: 'Logout erfolgreich!',
      }
    },
  },
  navItems: {
    top:  [
      { title: 'Dashboard', icon: 'dashboard', linkTo: 'Dashboard' },
      { title: 'Data Assets', icon: 'call_split', linkTo: 'DataAssets' },
      { title: 'Data Sources', icon: 'linear_scale', linkTo: 'SelectDataSource' },
      { title: 'Connector', icon: 'attachment', linkTo: 'Connector' },
      { title: 'Jobs', icon: 'fingerprint', linkTo: 'Jobs' },
      { title: 'Brokers', icon: 'cases', linkTo: 'Brokers' },
    ],
    bottom: [
      { title: 'Settings', icon: 'settings', linkTo: 'Settings' },
    ],
  },
  navItemsWithoutAuth: {
    top:  [
      { title: 'Connector', icon: 'attachment', linkTo: 'Connector' },
    ],
    bottom: [

    ],
  },
  dashboard: {
    title: 'Willkommen beim Public Data Space Connector.',
    description: 'Der Public Data Space Connector ermöglicht die einfache Bereitstellung von Open Data unter den Spezifikationen des International Data Spaces.\nDie Daten liegen dabei ursprünglich in verschiedenen Quellsystemen vor.',
    updateSettings: 'Konfiguration aktualisieren',
    jobs: 'Jobs verwalten',
    connector: 'Connector Endpoint',
    dataSources: 'Data Sources verwalten',
    dataAssets: 'Data Assets verwalten',
    dataAssetsPublished: 'Veröffentlichte Data Assets',
  },
  connector: {
    text: 'Loading connector data ...',
  },
  brokers: {
    title: 'Registrierte Broker',
    addNewBroker: 'Neuen Broker registrieren',
  },
  dataAssets: {
    title: 'Registrierte Datensätze',
    itemsPerPage: 5,
  },
  jobs: {
    title: 'Jobs',
  },
  dataSources: {
    title: 'Data Sources',
    text: 'Bitte wählen Sie eine Datenquelle aus, welcher ein weiteres Data Asset hinzugefügt werden soll oder fügen Sie eine weitere Datenquelle des Typs hinzu.',
  },
  settings: {
    title: 'Konfiguration des Connectors',
    description: 'Konfigurieren Sie ihren Connector zur korrekten Darstellung des IDS Informationsmodells.',
  },
  login: {
    title: 'Login',
    description: 'Bitte geben Sie ihren Benutzernamen und ihr Passwort ein.'
  },
}

export { glueConfig };
