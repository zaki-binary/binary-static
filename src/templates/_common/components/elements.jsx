import React from 'react';

export const Li = ({
    className,
    id,
    href,
    param = '',
    target,
    text,
    header,
    p,
}) => {
    const content = p ? <p>{text}</p> : text;

    return (
        <li id={id} className={className}>
            { header && (
                text ? <strong className='margin-right'>{header}</strong> : <h3>{header}</h3>
            )}
            { href ?
                <a
                    href={`${href}${param}`}
                    rel={/^http/.test(href) ? 'noopener noreferrer' : undefined}
                    target={target || undefined}
                >
                    {content}
                </a>
                : content
            }
        </li>
    );
};

export const List = ({ items, id, className }) => (
    <React.Fragment>
        { items.length ?
          <ul id={id} className={className}>
              {items.map((item, idx) => <Li key={idx} {...item} />)}
          </ul>
        :
          undefined
        }
    </React.Fragment>

);

export const InfoBox = ({ padding, header, sub_header, text }) => {
    let class1 = '';
    let class2 = '';
    if (padding) {
        class1 = padding ? `gr-${padding}` : 'gr-4';
        class2 = /^6/.test(padding) ? '' : 'gr-12-p';
        class2 += ' gr-12-m';
    }
    return (
        <div className={[class1, class2].join(' ')}>
            <div className='border-bottom'>
                <div className='fill-bg-color gr-padding-10'>
                    <h3 className='gr-gutter no-margin'>{header}</h3>
                </div>
                { sub_header ?
                    <React.Fragment>
                        <div className='gr-gutter gr-padding-10'>{sub_header}</div>
                        <p className='gr-gutter gr-parent gr-padding-10 no-margin'>
                            {text}
                        </p>
                    </React.Fragment>
                    :
                    <p className='gr-gutter gr-parent gr-padding-10'>
                        {text}
                    </p>
                }
            </div>
        </div>
    );
};

export const FillBox = ({
    padding,
    center,
    className = '',
    align_left,
    color,
    border,
    image,
    href,
    target,
    download,
    em,
    text,
    children,
}) => {
    let classes1 = '';
    if (padding) {
        classes1 = `gr-12-m gr-6-p gr-padding-10 gr-${padding}${center ? ' gr-centered' : ''}`;
    }

    let classes2 = '';
    classes2 += align_left ? '' : 'center-text ';
    classes2 += 'gr-gutter gr-padding-20 ';
    classes2 += color === 'dark' ? 'primary-bg-color ' : 'fill-bg-color ';
    classes2 += `${border || ''}`;

    return (
        <div className={[classes1, className].join(' ')}>
            <div className={classes2}>
                <div className='inline-flex center-align gr-gutter'>
                    { image &&
                        <img className='half-sized-picture gr-gutter-right' src={it.url_for(image)} />
                    }
                    { href ?
                        <a
                            href={href}
                            target={target || undefined}
                            download={!!download}
                            className={color === 'dark' ? 'content-inverse-color' : undefined}
                            rel={/^http/.test(href) ? 'noopener noreferrer' : undefined}
                        >
                            {em ? <em> {text} </em> : text}
                        </a>
                        :
                        <p className='gr-gutter'>
                            {em ? <em> {text} </em> : text}
                        </p>
                    }
                </div>
            </div>
            {children}
        </div>
    );
};

export const Select = ({ id, className, options }) => (
    <select id={id} className={className} >
        {options.map((option, idx) => (
            <option key={idx} value={option.value || undefined} selected={!!option.selected} >
                {option.text}
            </option>
        ))}
    </select>
);

export const Tbody = ({ trs, tbody_id }) => (
    <tbody id={tbody_id}>
        {trs && trs.map((tr, inx_tr) => (
            <tr key={inx_tr}>
                {tr.map((td, inx_td) => (
                    td.header ?
                        <th key={inx_td} className={td.className} {...td.balloon ? { 'data-balloon': td.balloon } : {}}>
                            {td.header}
                        </th>
                        :
                        <td key={inx_td} className={td.className} id={td.id}>
                            {td.text}
                        </td>
                ))}
            </tr>
        ))}
    </tbody>
);

export const Table = ({
    id,
    className,
    data,
    scroll,
    tbody_id,
}) => {
    const content = (
        <table id={id} className={className}>
            { data.thead &&
                <thead>
                    { data.thead.map((row, tr_inx) => (
                        <tr key={tr_inx}>
                            {row.map((th, th_inx) => (
                                <th key={th_inx} className={th.className} >{th.text}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
            }
            <Tbody
                trs={data.tbody || []}
                tbody_id={tbody_id}
            />
            { data.tfoot &&
                <tfoot>
                    { data.tfoot.map((row, tr_inx) => (
                        <tr key={tr_inx}>
                            {row.map((th, th_inx) => (
                                <th
                                    key={th_inx}
                                    className={th.className}
                                    id={th.id}
                                    {...(th.attributes || {})}
                                >
                                    {th.text}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            }
        </table>
    );
    return (
        scroll ?
            <div className='table-container'>
                {content}
            </div>
            :
            content
    );
};
