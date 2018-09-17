/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}
const pre = "```";

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('gondel.png')} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href="#try">Try It Out</Button>
            <Button href={docUrl('intro.html', language)}>Introduction</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <React.Fragment>
    <Block layout="fourColumn">
      {[
        {
          title: 'No Vendor Lockin',
          content: `Gondel works with almost every frontend and backend framework.
  Gondel UI Components are not only reusable with React Angular or Vue but also with unflexible backend solutions`,
          image: imgUrl('open.svg'),
          imageAlign: 'top',
        },
        {
          title: 'Modular',
          content: 'Gondel allows you to built independent and reusable components.',
          image: imgUrl('modular.svg'),
          imageAlign: 'top',
        },
        {
          title: 'Fast',
          content: 'Gondel is treeshakable and has less than 3kb gziped',
          image: imgUrl('fast.png'),
          imageAlign: 'top',
        },
      ]}
    </Block>
    <Block layout="fourColumn">
      {[
        {
          title: 'Optional Typings',
          content: `Gondel ships with optional typings for typescript`,
          image: imgUrl('ts.png'),
          imageAlign: 'top',
        },
        {
          title: 'Support for JSX',
          content: 'Gondel provides a react plugin for client side rendering',
          image: imgUrl('react.svg'),
          imageAlign: 'top',
        },
        {
          title: 'VanillaJs',
          content: 'Gondel has zero dependencies and can be used without any framework',
          image: imgUrl('js.svg'),
          imageAlign: 'top',
        },
      ]}
    </Block>
  </React.Fragment>
);


const codeExampleJs =`${pre}javascript
import { Component, EventListener, GondelBaseComponent } from '@gondel/core';

// The @Component decorator will connect the class with \`data-g-name="Button"\` elements.
@Component('Button')
export class Button extends GondelBaseComponent {
  @EventListener('click')
  _handleChange(event) {
    alert('Hello World')
  }
}
${pre}`;

const codeExampleHTML =`${pre}html
<button data-g-name="Button">Click me</button>

<button data-g-name="Button">Or click me</button>
${pre}`;

const LearnHow = props => (
  <Container
    padding={['bottom', 'top']}
    id='try'>
    <h2>Hello World</h2>
    <MarkdownBlock>
      {codeExampleJs}
    </MarkdownBlock>
    <MarkdownBlock>
        {codeExampleHTML}
    </MarkdownBlock>
  </Container>
);

const TryOut = props => (
  <Container
    padding={['bottom', 'top']}
    id='try'>
      <h2>codesandbox</h2>
      <iframe
        src="https://codesandbox.io/embed/github/namics/gondel/tree/master/examples/typescript?codemirror=1&module=/src/components/button.ts"
        style={{width: '100%', height:500, border:0, borderRadius: '4px', overflow:'hidden'}}
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin">
      </iframe>
  </Container>
);

const Description = props => (
  <Block background="dark">
    {[
      {
        content: 'This is another description of how this project is useful',
        image: imgUrl('gondel.png'),
        imageAlign: 'right',
        title: 'Description',
      },
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned;
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} alt={user.caption} title={user.caption} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <LearnHow />
          <TryOut />
          {/* <Description /> *}
          {/* <Showcase language={language} /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
