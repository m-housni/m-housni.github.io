try {
    fetch('./brain/db/resume.json')
        .then(response => response.json())
        .then(data => {
            document.body.classList.remove('hidden');
            document.getElementById('name').textContent = data.info.name;
            document.getElementById('title').textContent = data.info.title;
            document.getElementById('location').textContent = data.info.location;
            document.getElementById('email').textContent = data.info.email;
            document.getElementById('email').href = `mailto:${data.info.email}`;
            document.getElementById('phone').textContent = data.info.phone;
            document.getElementById('phone').href = `tel:${data.info.phone}`;
            document.getElementById('website').textContent = data.info.website;
            document.getElementById('website').href = data.info.website;
            document.getElementById('linkedin').textContent = data.info.linkedin;
            document.getElementById('linkedin').href = data.info.linkedin;
            document.getElementById('github').textContent = data.info.github;
            document.getElementById('github').href = data.info.github;
            document.getElementById('summary').innerHTML = data.info.summary;
            try {
                const skillsContainer = document.getElementById('skills');
                for (const [category, skills] of Object.entries(data.skills)) {
                    const skillDiv = document.createElement('div');
                    skillDiv.innerHTML = `<h3 class="font-semibold">${category.replace(/([A-Z])/g, ' $1')}</h3><ul class="list-disc list-inside">${skills.map(skill => `<li class="text-sm">${skill}</li>`).join('')}</ul>`;
                    skillsContainer.appendChild(skillDiv);
                    //func()
                }
            } catch (error) {
                console.error(error);
            }

            // focus areas
            const focusContainer = document.getElementById('focusAreas');
            data.focusAreas.sort((a, b) => {
                if (a.toLowerCase() < b.toLowerCase()) return -1;
                if (a.toLowerCase() > b.toLowerCase()) return 1;
                return 0;
            });
            data.focusAreas.forEach(focus => {
                const focusDiv = document.createElement('div');
                focusDiv.classList.add('text-sm');
                focusDiv.innerHTML = `<span class="text-sm">${focus}</span>`;
                focusContainer.appendChild(focusDiv);
            });

            const skillsCloudContainer = document.getElementById('skillsCloud');
            const skillsCount = {};

            // get skills from experiences
            for (const [company, experience] of Object.entries(data.experiences)) {
                experience.skills.split(',').forEach(skill => {
                    skill = skill.trim();
                    skillsCount[skill] = (skillsCount[skill] || 0) + 1;
                });
            }

            // get skills from projects
            data.projects.forEach(project => {
                project.tags.split(",").forEach(tag => {
                    tag = tag.trim();
                    skillsCount[tag] = (skillsCount[tag] || 0) + 1;
                });
            });

            const orderedSkillsCloud = Object.entries(skillsCount)
                .sort((a, b) => b[1] - a[1]);

            orderedSkillsCloud.forEach(([skill, count]) => {
                const skillDiv = document.createElement('div');
                skillDiv.innerHTML = `<span class="text-xs">${skill} (${count})</span>`;
                skillsCloudContainer.appendChild(skillDiv);
            });

            // const orderedSkillsCloud0 = Object.entries(skillsCount)
            // .sort((a, b) => b[1] - a[1]).filter(([skill, count]) => count >= 3);

            // const skillsCloudContainer0 = document.getElementById('skillsCloud0');
            // orderedSkillsCloud0.forEach(([skill, count]) => {
            //     const skillDiv = document.createElement('div');
            //     skillDiv.innerHTML = `<span class="text-xs">${skill} (${count})</span>`;
            //     skillsCloudContainer0.appendChild(skillDiv);
            // });

            //
            const experiencesContainer = document.getElementById('experiences');
            for (const [company, experience] of Object.entries(data.experiences)) {
                const experienceDiv = document.createElement('div');
                experienceDiv.classList.add('mb-4');
                experienceDiv.innerHTML = `<h3 class="font-semibold">${experience.title} - ${experience.location}</h3><p class="text-sm underline">${experience.dates}</p><p>${experience.description}</p><ul class="list-disc list-inside">${experience.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul><p>${experience.skills.split(',').map(skill => `<span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">${skill.trim()}</span>`).join('')}</p>`;
                experiencesContainer.appendChild(experienceDiv);
            }

            const projectsContainer = document.getElementById('projects');
            // order the projects by timestamp
            data.projects.sort((a, b) => b.timestamp - a.timestamp);
            data.projects.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.classList.add('mb-4');
                projectDiv.innerHTML = `<h3 class="font-semibold">${project.title}</h3><p>${project.description}</p><p><i class="fab fa-github text-sm opacity-50"></i>  <a target="_blank" href="${project.link}" class="text-sm text-blue-500">${project.link}</a></p><p class="text-sm">${project.tags.split(",").map(tag => `<span class="mr-2">${tag}</span>`).join('')}</p>`;
                projectsContainer.appendChild(projectDiv);
            });

            const certificationsContainer = document.getElementById('certifications');
            data.certifications.forEach(certification => {
                const certificationDiv = document.createElement('div');
                certificationDiv.classList.add('mb-4');
                certificationDiv.innerHTML = `<h3 class="font-semibold">${certification.title}</h3><p class="text-sm">${certification.date}</p><p><a target="_blank" href="${certification.link}" class="text-blue-500">${certification.link}</a></p>`;
                certificationsContainer.appendChild(certificationDiv);
            });

            const educationContainer = document.getElementById('education');
            for (const [degree, education] of Object.entries(data.education)) {
                const educationDiv = document.createElement('div');
                educationDiv.classList.add('mb-4');
                educationDiv.innerHTML = `<h3 class="font-semibold">${education.degree}</h3><p>${education.school}, ${education.location}</p><p class="text-sm">${education.dates}</p>`;
                educationContainer.appendChild(educationDiv);
            }

            const languagesContainer = document.getElementById('languages');
            for (const [language, proficiency] of Object.entries(data.languages)) {
                const languageLi = document.createElement('li');
                languageLi.textContent = `${language}: ${proficiency}`;
                languagesContainer.appendChild(languageLi);
            }

            const interestsContainer = document.getElementById('interests');
            data.interests.forEach(interest => {
                const interestLi = document.createElement('li');
                interestLi.textContent = interest;
                interestsContainer.appendChild(interestLi);
            });
        });

        
        document.querySelector("nav").addEventListener("dblclick", event => {
            document.querySelectorAll(".hidden-on-load").forEach(el => {
                el.classList.remove("hidden-on-load")
            })
        });

    } catch (error) {
        console.error(error)
    }

    document.getElementById('name').addEventListener('dblclick', () => {
        document.querySelectorAll('*').forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });
    });