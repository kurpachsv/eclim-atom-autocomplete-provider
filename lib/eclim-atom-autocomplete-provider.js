'use babel';

import EclimAtomAutocompleteProviderView from './eclim-atom-autocomplete-provider-view';
import { CompositeDisposable } from 'atom';

export default {

  eclimAtomAutocompleteProviderView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.eclimAtomAutocompleteProviderView = new EclimAtomAutocompleteProviderView(state.eclimAtomAutocompleteProviderViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.eclimAtomAutocompleteProviderView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'eclim-atom-autocomplete-provider:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.eclimAtomAutocompleteProviderView.destroy();
  },

  serialize() {
    return {
      eclimAtomAutocompleteProviderViewState: this.eclimAtomAutocompleteProviderView.serialize()
    };
  },

  toggle() {
    console.log('EclimAtomAutocompleteProvider was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
