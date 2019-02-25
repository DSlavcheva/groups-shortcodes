/**
 * BLOCK: groups-shortcodes
 *
 *
 */

//import React Select2
import CreatableSelect from 'react-select/lib/Creatable';
//import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';

const { apiFetch }      = wp;
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerStore, withSelect }        = wp.data; // Import registerStore, withSelect from wp.data
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InspectorControls, InnerBlocks } = wp.editor; // Import InspectorControls, InnerBlocks from wp.editor
const { PanelBody, PanelRow, Spinner } = wp.components; // Import PanelBody, SelectControl from wp.components

/**
 * Actions
 */
const actions = {
	setGroups( groups ) {
		return {
			type: 'SET_GROUPS',
			groups,
		};
	},
	receiveGroups( path ) {
		return {
			type: 'RECEIVE_GROUPS',
			path,
		};
	},
};

/**
 * Register Store
 */
const store = registerStore( 'groups/groups-shortcodes', {
	reducer( state = { groups: {} }, action ) {

		switch ( action.type ) {
			case 'SET_GROUPS':
				return {
					...state,
					groups: action.groups,
				};
		}

		return state;
	},

	actions,

	selectors: {
		receiveGroups( state ) {
			const { groups } = state;
			return groups;
		},
	},

	controls: {
		RECEIVE_GROUPS( action ) {
			return apiFetch( { path: action.path } );
		},
	},

	resolvers: {
		* receiveGroups( state ) {
			const groups = yield actions.receiveGroups( '/groups/groups-shortcodes/groups/' );
			return actions.setGroups( groups );
		},
	},
} );

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'groups/groups-shortcodes', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Groups Shortcodes','groups-shortcodes' ), // Block title.
	description: __( 'Restrict content for members of particular groups', 'groups-shortcodes' ),
	icon: 'screenoptions', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'groups-shortcodes' ),
	],
	attributes: {
			groups_select: {
				type:    'string',
				default: null
			},
		},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	 edit: withSelect( ( select ) => {
			 return {
				 groups: select('groups/groups-shortcodes').receiveGroups(),
			 };
		 } )( props => {
			const { attributes: { groups_select }, groups, className, setAttributes, isSelected } = props;
			const handleGroupsChange = ( groups_select ) => setAttributes( { groups_select: JSON.stringify( groups_select ) } );
			let selectedGroups = [];
			if ( null !== groups_select ) {
				selectedGroups = JSON.parse( groups_select );
			}

			// Show if the data is not loaded yet.
			if ( ! groups.length ) {
				return (
					<p className={className} >
						<Spinner />
						{ __( 'Loading Data', 'groups-shortcodes' ) }
					</p>
				);
			}

			return [
				<InspectorControls>
					<PanelBody title={ __( 'Select Groups', 'groups-shortcodes' ) } className="block-inspector">
					<PanelRow>
							<label htmlFor="block-groups" className="groups-inspector__label">
									{ __( 'Content will be shown to users that are members of these groups:', 'groups-shortcodes' ) }
							</label>
					</PanelRow>
						<PanelRow>
								<CreatableSelect
									className="groups-inspector__control"
									name='block-groups'
									value={ selectedGroups }
									onChange={ handleGroupsChange }
									options={ groups }
									isClearable
									isMulti='true'
								 />
						</PanelRow>
					</PanelBody>
				</InspectorControls>,
				  <div className={ props.className }>
			      { __( 'Add Blocks with restricted content.', 'groups-shortcodes' ) }
			      <InnerBlocks />
			    </div>
			];
		} ),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: props => {
		return (
      <InnerBlocks.Content />
		);
	},
} );
