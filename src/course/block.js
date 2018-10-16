/**
 * BLOCK: Course Information
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';



const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { ServerSideRender, TextControl, CheckboxControl, Disabled, SelectControl } = wp.components;
const { InspectorControls } = wp.editor;
const { Fragment, Component } = wp.element;

// import { Fragment, Component } from 'react';
//import { ClassSubjectSelect } from './component-class-api.js';

class ClassSubjectSelect extends Component {
	constructor() {
		super(...arguments);
		this.nodeRef = null;
		this.bindRef = this.bindRef.bind(this);
		this.state = {
			error: null,
			isLoaded: false,
			classList: []
		};
	}

	bindRef(node) {
		if (!node) {
			return;
		}
		this.nodeRef = node;
	}

	componentDidMount() {
		fetch("https://wwwtest.bellevuecollege.edu/aproot/data/api/v1/subject")
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						classList: result,
					});
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)
	}

	render() {
		const { error, isLoaded, classList } = this.state;
		const { attributes, setAttributes } = this.props;
		//const { attributes } = this.props;
		return (
			<Fragment>
				
				<SelectControl
					label="Subject"
					value={attributes.subject}
					options={[
						{ label: 'Big', value: '100%' },
						{ label: 'Medium', value: '50%' },
						{ label: 'Small', value: '25%' },
					]}
				/>
			</Fragment>
		)
	}
}
export default ClassSubjectSelect;

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

registerBlockType( 'mayflower-blocks/course', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'BC Course' ), // Block title.
	icon: 'welcome-learn-more', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.

	attributes: {
		subject: {
			type: 'string',
		},
		item: {
			type: 'string',
		},
		description: {
			type: 'boolean',
		},
	},

	edit: function ({setAttributes, attributes, className, isSelected}) {
		// ensure the block attributes matches this plugin's name
		let editBlock;
		if ( isSelected ) {
			editBlock = (
				<div class="controls">
					<TextControl
						label="Subject"
						value={attributes.subject}
						onChange={(subject) => setAttributes({ subject })}
					/>
					<TextControl
						label="Item"
						value={attributes.item}
						onChange={(item) => setAttributes({ item })}
					/>
				</div>
			)
		}

		return (
			<Fragment>
				<InspectorControls>
					<CheckboxControl
						label="Display Course Description"
						checked={attributes.description}
						onChange={(description) => setAttributes({ description })}
					/>
				</InspectorControls>
				<div class={className}>
					{editBlock}
					<ClassSubjectSelect
						attributes = {attributes}
						onChange={(subject) => setAttributes({ subject })}
					/>
					<Disabled>
						<ServerSideRender
							block="mayflower-blocks/course"
							attributes= { attributes }
						/>
					</Disabled>
				</div>
			</Fragment>
		);
	},

	save() {
		// Rendering in PHP
		return null;
	},
} );
